import type { UserRepository } from "../../domain/repositories/user.repository.js";
import { UserAlreadyExistsError } from "../../shared/erors/domain.errors.js";
import type { AuditLogger } from "../../shared/logger/audit.logger.js";
import type { UseCase } from "../interfaces/useCase.js";

export class RegisterUserUseCase implements UseCase<any,any> {
  constructor(
    private userRepository: UserRepository,
    private auditLogger: AuditLogger,
  ) {}

  async execute(data: { email: string; password: string }) {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new UserAlreadyExistsError();
    }

    const user = await this.userRepository.create(data);

    this.auditLogger.logAction({
      userId: user.id,
      action: "USER_REGISTERED",
    });

    return user;
  }
}
