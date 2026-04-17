import { CreateUserEntity, DBUser } from "../../domain/entities/user.entity.js";
import type { PrismaUserRepository } from "../../domain/repositories/user.repository.js";
import { AppError } from "../../shared/erors/base.error.js";
import {
  BcryptHashError,
  UserAlreadyExistsError,
} from "../../shared/erors/domain.errors.js";
import type { AuditLogger } from "../../shared/logger/audit.logger.js";
import type { BcryptService } from "../../shared/security/bcrypt.service.js";
import type { RegisterUserDTO } from "../../shared/types/index.js";
import type { UseCase } from "../interfaces/useCase.js";

export class RegisterUserUseCase implements UseCase<any, any> {
  constructor(
    private userRepository: PrismaUserRepository,
    private readonly hashService: BcryptService,
    private auditLogger?: AuditLogger,
  ) {}

  async execute(data: RegisterUserDTO) {
    // =========================
    // 1. NORMALIZE EMAIL
    // =========================
    const userEmail = data.email.trim().toLowerCase();

    // =========================
    // 2. CHECK IF USER EXISTS
    // =========================

    const existingUser = await this.userRepository.findByEmail(userEmail);

    if (existingUser) {
      throw new UserAlreadyExistsError();
    }

    // =========================
    // 3. HASH PASSWORD
    // =========================
    let hashedPassword = "";
    try {
      hashedPassword = await this.hashService.hash(data.password);
      // =========================
      // 4. CREATE USER ENTITY
      // =========================
      const userEntity = new CreateUserEntity({
        email: userEmail,
        password: hashedPassword,
      });

      // =========================
      // 5. SAVE USER
      // =========================
      const { email, password } = userEntity;
      const savedUser = await this.userRepository.create({ email, password });

      this.auditLogger?.logAction({
        userId: savedUser.id,
        action: "USER_REGISTERED",
      });

      // =========================
      // 6. RETURN SAFE OUTPUT
      // =========================

      
      const dbUser:DBUser = new DBUser({email:savedUser.email,password:savedUser.password,createdAt:savedUser.createdAt,updatedAt:savedUser.updatedAt,id:savedUser.id})

      return dbUser.toJSON();
    } catch (err: any) {
      throw new BcryptHashError();
    }
  }
}
