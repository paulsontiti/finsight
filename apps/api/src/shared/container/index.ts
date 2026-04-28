// Repositories

// Use Cases
import { FundWalletUseCase } from "../../application/use-cases/fund-wallet.usercase.js";
import { LoginUserUseCase } from "../../application/use-cases/login-user.usecase.js";
import { RefreshTokenUseCase } from "../../application/use-cases/refresh-token.usecase.js";
import { RegisterUserUseCase } from "../../application/use-cases/register-user.usecase.js";
import { ResetPasswordUseCase } from "../../application/use-cases/reset-password.usecase.js";
import { SendResetPasswordUseCase } from "../../application/use-cases/send-reset-password.usecase.js";
import { VerifyEmailUseCase } from "../../application/use-cases/verify-email.usecase.js";
import { PrismaPasswordResetTokenRepository } from "../../domain/repositories/prisma-password-reset.repository.js";
import { PrismaRefreshTokenRepository } from "../../domain/repositories/refresh-token.repository.js";
import { PrismaUserRepository } from "../../domain/repositories/user.repository.js";
import { PrismaVerificationTokenRepository } from "../../domain/repositories/verification-token.repository.js";
import { MockMailer } from "../../services/mock-mailer.service.js";
import { RefreshTokenService } from "../../services/refresh-token.service.js";
import { TokenGeneratorService } from "../../services/token-generator.service.js";
import { ValidationsService } from "../../services/validations-service.js";
import { ConfigService } from "../config/config.service.js";
import { Container } from "../container.js";
import { AuditLogger } from "../logger/audit.logger.js";
import { TransactionLogger } from "../logger/transaction.logger.js";
import { BcryptService } from "../security/bcrypt.service.js";
import { JwtService } from "../security/jwt.service.js";

// Shared instance
export const container = new Container();

/**
 * =========================
 * REGISTER CONFIG
 * =========================
 */
container.register("configService", () => new ConfigService(), true);

/**
 * =========================
 * REGISTER REPOSITORIES
 * =========================
 */
container.register("userRepository", () => {
  return new PrismaUserRepository();
});

container.register("refreshRepository", () => {
  return new PrismaRefreshTokenRepository();
});
container.register("emailVerificationRepository", () => {
  return new PrismaVerificationTokenRepository();
});

container.register("passwordResetTokenRepository", () => {
  return new PrismaPasswordResetTokenRepository();
});

/**
 * =========================
 * REGISTER SERVICES
 * =========================
 */
container.register("hashServiceRepository", () => {
  return new BcryptService();
});

container.register("mockMailerService", () => {
  return new MockMailer();
});

container.register("tokenGeneratorService", () => {
  return new TokenGeneratorService();
});

container.register("jwtTokenService", () => {
  const config = container.resolve<any>("configService");
  const jwtSecret = config.get("JWT_SECRET");
  return new JwtService(jwtSecret);
});

container.register("refreshTokenService", () => {
  const refreshRepository = container.resolve<any>("refreshRepository");
  const hashService = container.resolve<BcryptService>("hashServiceRepository");
  return new RefreshTokenService(refreshRepository, hashService);
});

/**
 * =========================
 * REGISTER LOGGERS
 * =========================
 */
container.register(
  "auditLogger",
  () => {
    return new AuditLogger();
  },
  true,
);
container.register(
  "transactionLogger",
  () => {
    return new TransactionLogger();
  },
  true,
);

/**
 * =========================
 * REGISTER USE CASES
 * =========================
 */
container.register("registerUserUseCase", (c) => {
  const userRepo = c.resolve<PrismaUserRepository>("userRepository");
  const auditLogger = c.resolve<AuditLogger>("auditLogger");
  const hashService = c.resolve<BcryptService>("hashServiceRepository");

  return new RegisterUserUseCase(userRepo, hashService, auditLogger);
});

container.register("loginUserUseCase", (c) => {
  const userRepo = c.resolve<PrismaUserRepository>("userRepository");
  const hashService = c.resolve<BcryptService>("hashServiceRepository");
  const jwtTokenService = container.resolve<JwtService>("jwtTokenService");
  const refreshTokenService = container.resolve<RefreshTokenService>(
    "refreshTokenService",
  );

  return new LoginUserUseCase(
    userRepo,
    hashService,
    jwtTokenService,
    refreshTokenService,
  );
});

container.register("resetPasswordUserUseCase", (c) => {
  const userRepo = c.resolve<PrismaUserRepository>("userRepository");
  const hashService = c.resolve<BcryptService>("hashServiceRepository");
  const passwordResetTokenRepository =
    container.resolve<PrismaPasswordResetTokenRepository>(
      "passwordResetTokenRepository",
    );

  return new ResetPasswordUseCase(
    passwordResetTokenRepository,
    userRepo,
    hashService,
  );
});

container.register("sendResetPasswordUserUseCase", (c) => {
  const userRepo = c.resolve<PrismaUserRepository>("userRepository");
  const mockMailerService = c.resolve<MockMailer>("mockMailerService");
  const passwordResetTokenRepository =
    container.resolve<PrismaPasswordResetTokenRepository>(
      "passwordResetTokenRepository",
    );
  const tokenGeneratorService = container.resolve<TokenGeneratorService>(
    "tokenGeneratorService",
  );

  return new SendResetPasswordUseCase(
    passwordResetTokenRepository,
    userRepo,
    tokenGeneratorService,
    mockMailerService,
  );
});

container.register("refreshTokenUseCase", (c) => {
  const refreshTokenService = c.resolve<RefreshTokenService>(
    "refreshTokenService",
  );
  const jwtTokenService = c.resolve<JwtService>("jwtTokenService");
  return new RefreshTokenUseCase(jwtTokenService, refreshTokenService);
});

container.register("verifyEmailUseCase", (c) => {
  const userRepo = c.resolve<PrismaUserRepository>("userRepository");
  const emailVerificationRepo = c.resolve<PrismaVerificationTokenRepository>(
    "emailVerificationRepository",
  );
  return new VerifyEmailUseCase(emailVerificationRepo, userRepo);
});

container.register("fundWalletUseCase", (c) => {
  const transactionLogger = c.resolve<TransactionLogger>("transactionLogger");

  return new FundWalletUseCase(transactionLogger);
});
