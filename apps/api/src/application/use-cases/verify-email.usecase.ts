
import { InvalidCredentialsError } from "../../shared/erors/domain.errors.js";
import type { IUserRepository, IVerificationTokenRepository } from "../../shared/types/index.js";
import type { UseCase } from "../interfaces/useCase.js";


export class VerifyEmailUseCase implements UseCase<string,{verified:boolean}> {
  constructor(
    private readonly tokenRepo: IVerificationTokenRepository,
    private readonly userRepo: IUserRepository
  ) {}

  async execute(token: string) {
    if (!token) {
      throw new InvalidCredentialsError("Token required");
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
      throw new InvalidCredentialsError("User not found");
    }

    await this.userRepo.update({isVerified:true});

    await this.tokenRepo.delete(record.id);

    return { verified: true };
  }
}