

// Repositories


// Use Cases
import { FundWalletUseCase } from "../../application/use-cases/fund-wallet.usercase.js";
import { RegisterUserUseCase } from "../../application/use-cases/register-user.usecase.js";
import { PrismaUserRepository } from "../../domain/repositories/user.repository.js";
import { ConfigService } from "../config/config.service.js";
import { Container } from "../container.js";
import { AuditLogger } from "../logger/audit.logger.js";
import { TransactionLogger } from "../logger/transaction.logger.js";
import { BcryptService } from "../security/bcrypt.service.js";

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

container.register("hashServiceRepository", () => {
  return new BcryptService();
});

/**
 * =========================
 * REGISTER LOGGERS
 * =========================
 */
container.register("auditLogger", () => {
  return new AuditLogger();
},true);
container.register("transactionLogger", () => {
  return new TransactionLogger();
},true);

/**
 * =========================
 * REGISTER USE CASES
 * =========================
 */
container.register("registerUserUseCase", (c) => {
  const userRepo = c.resolve<PrismaUserRepository>("userRepository");
  const auditLogger = c.resolve<AuditLogger>("auditLogger");
  const hashService = c.resolve<BcryptService>("hashServiceRepository");

  return new RegisterUserUseCase(userRepo,hashService,auditLogger);
});

container.register("fundWalletUseCase", (c) => {
  //const userRepo = c.resolve<UserRepository>("userRepository");
  const transactionLogger = c.resolve<TransactionLogger>("transactionLogger");

  return new FundWalletUseCase(transactionLogger);
});