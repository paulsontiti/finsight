import type { PrismaPasswordResetTokenRepository } from "../../domain/repositories/prisma-password-reset.repository.js";
import {
  InvalidCredentialsError,
  UserNotFoundError,
} from "../../shared/erors/domain.errors.js";
import { DatabaseError } from "../../shared/erors/system.error.js";
import type {
  IHashService,
  ITokenRepository,
  IUserRepository,
} from "../../shared/types/index.js";
import type { UseCase } from "../interfaces/useCase.js";

export class ResetPasswordUseCase implements UseCase<
  { token: string; newPassword: string },
  { reset: boolean }
> {
  constructor(
    private readonly tokenRepo: PrismaPasswordResetTokenRepository,
    private readonly userRepo: IUserRepository,
    private readonly hashService: IHashService,
  ) {}

  async execute(data: { token: string; newPassword: string }) {
    const { token, newPassword } = data;
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

    try {
      const user = await this.userRepo.findById(record.userId);

      if (!user) {
        throw new UserNotFoundError();
      }

      const hashedPassword = await this.hashService.hash(newPassword);

      //user.setPassword(hashedPassword);

      await this.userRepo.update(user.id, { password: hashedPassword });

      await this.tokenRepo.delete(record.id);

      return { reset: true };
    } catch (err: any) {
      if (err instanceof InvalidCredentialsError) {
        throw new InvalidCredentialsError();
      }
      if (err instanceof UserNotFoundError) {
        throw new UserNotFoundError();
      }
      throw new DatabaseError();
    }
  }
}
