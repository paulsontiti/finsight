import type { EmailVerificaionProp, IGenerator, ITokenRepository } from "../../shared/types/index.js";

import type { UseCase } from "../interfaces/useCase.js";

export class SendVerificationUseCase implements UseCase<EmailVerificaionProp,{success:boolean}>{
  constructor(
    private readonly repo: ITokenRepository,
    private readonly tokenGenerator: IGenerator,
    private readonly mailer: any
  ) {}

  async execute(data:EmailVerificaionProp) {
    const {userId,email} = data;
    const token = this.tokenGenerator.generate();

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await this.repo.create({
      userId,
      token,
      expiresAt
    });

    await this.mailer.send({
      to: email,
      subject: "Verify your account",
      body: `Click to verify: http://localhost:3000/verify?token=${token}`
    });

    return { success: true };
  }
}