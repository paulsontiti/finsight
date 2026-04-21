import { UserNotFoundError } from "../../shared/erors/domain.errors.js";
import type { IGenerator, IHashService, IMailer, ITokenRepository, IUserRepository } from "../../shared/types/index.js";
import type { UseCase } from "../interfaces/useCase.js";


export class SendResetPasswordUseCase implements UseCase<string,{success:boolean}>{
  constructor(
    private readonly tokenRepo: ITokenRepository,
    private readonly userRepo: IUserRepository,
    private readonly tokenGenerator: IGenerator,
    private readonly mailer: IMailer,
  ) {}

  async execute(email: string) {
    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      throw new UserNotFoundError();
    }

    const token = this.tokenGenerator.generate();

    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 mins

    //const hashedToken = await this.hashService.hash(token);

    await this.tokenRepo.create({
      userId: user.id,
      token,
      expiresAt
    });

    await this.mailer.send({
      to: email,
      subject: "Reset your password",
      body: `Reset link: http://localhost:3000/reset-password?token=${token}`
    });

    return { success: true };
  }
}