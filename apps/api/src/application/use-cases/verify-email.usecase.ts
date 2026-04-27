import {
  InvalidCredentialsError,
  UserNotFoundError,
} from "../../shared/erors/domain.errors.js";
import { DatabaseError } from "../../shared/erors/system.error.js";
import type {
  ITokenRepository,
  IUserRepository,
} from "../../shared/types/index.js";
import type { UseCase } from "../interfaces/useCase.js";

export class VerifyEmailUseCase implements UseCase<
  string,
  { verified: boolean }
> {
  constructor(
    private readonly tokenRepo: ITokenRepository,
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(token: string) {
    try {
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

      try {
        const user = await this.userRepo.findById(record.userId);
        if (!user) {
          throw new InvalidCredentialsError("User not found");
        }

        try {
          await this.userRepo.update(user.id, { isVerified: true });

          await this.tokenRepo.delete(record.id);
        } catch (err: any) {
          throw new DatabaseError(err.message);
        }
      } catch (err: any) {
        throw new UserNotFoundError();
      }

      return { verified: true };
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
