import { InvalidCredentialsError, UserNotFoundError } from "../../shared/erors/domain.errors.js";
import type { IHashService, ITokenRepository, IUserRepository } from "../../shared/types/index.js";
import type { UseCase } from "../interfaces/useCase.js";


export class ResetPasswordUseCase implements UseCase<{token:string,newPassword:string},{reset:boolean}>{
  constructor(
    private readonly tokenRepo: ITokenRepository,
    private readonly userRepo: IUserRepository,
    private readonly hashService: IHashService
  ) {}

  async execute(data:{token: string, newPassword: string}) {

    const {token,newPassword} = data;
    if (!token || !newPassword) {
      throw new InvalidCredentialsError("Token and password required");
    }

    
    const record = await this.tokenRepo.find(token);

    if (!record) {
      throw new InvalidCredentialsError("Invalid token");
    }

    if (record.expiresAt < new Date()) {
      throw new InvalidCredentialsError("Token expired");
    }

    const user = await this.userRepo.findById(record.userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const hashedPassword = await this.hashService.hash(newPassword);

    //user.setPassword(hashedPassword);

    await this.userRepo.update({password:hashedPassword});

    await this.tokenRepo.delete(record.id);

    return { reset: true };
  }
}