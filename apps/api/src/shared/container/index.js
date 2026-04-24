// Repositories
// Use Cases
import { FundWalletUseCase } from "../../application/use-cases/fund-wallet.usercase.js";
import { LoginUserUseCase } from "../../application/use-cases/login-user.usecase.js";
import { RegisterUserUseCase } from "../../application/use-cases/register-user.usecase.js";
import { PrismaRefreshTokenRepository } from "../../domain/repositories/refresh-token.repository.js";
import { PrismaUserRepository } from "../../domain/repositories/user.repository.js";
import { RefreshTokenService } from "../../services/refresh-token.service.js";
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
/**
 * =========================
 * REGISTER SERVICES
 * =========================
 */
container.register("hashServiceRepository", () => {
    return new BcryptService();
});
container.register("jwtTokenService", () => {
    const config = container.resolve("configService");
    const jwtSecret = config.get("JWT_SECRET");
    return new JwtService(jwtSecret);
});
container.register("refreshTokenService", () => {
    const refreshRepository = container.resolve("refreshRepository");
    const hashService = container.resolve("hashServiceRepository");
    return new RefreshTokenService(refreshRepository, hashService);
});
/**
 * =========================
 * REGISTER LOGGERS
 * =========================
 */
container.register("auditLogger", () => {
    return new AuditLogger();
}, true);
container.register("transactionLogger", () => {
    return new TransactionLogger();
}, true);
/**
 * =========================
 * REGISTER USE CASES
 * =========================
 */
container.register("registerUserUseCase", (c) => {
    const userRepo = c.resolve("userRepository");
    const auditLogger = c.resolve("auditLogger");
    const hashService = c.resolve("hashServiceRepository");
    return new RegisterUserUseCase(userRepo, hashService, auditLogger);
});
container.register("loginUserUseCase", (c) => {
    const userRepo = c.resolve("userRepository");
    const hashService = c.resolve("hashServiceRepository");
    const jwtTokenService = container.resolve("jwtTokenService");
    const refreshTokenService = container.resolve("refreshTokenService");
    return new LoginUserUseCase(userRepo, hashService, jwtTokenService, refreshTokenService);
});
container.register("fundWalletUseCase", (c) => {
    //const userRepo = c.resolve<UserRepository>("userRepository");
    const transactionLogger = c.resolve("transactionLogger");
    return new FundWalletUseCase(transactionLogger);
});
//# sourceMappingURL=index.js.map