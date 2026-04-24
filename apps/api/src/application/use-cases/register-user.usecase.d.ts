import type { PrismaUserRepository } from "../../domain/repositories/user.repository.js";
import type { AuditLogger } from "../../shared/logger/audit.logger.js";
import type { IHashService, RegisterLoginUserDTO } from "../../shared/types/index.js";
import type { UseCase } from "../interfaces/useCase.js";
export declare class RegisterUserUseCase implements UseCase<any, any> {
    private userRepository;
    private readonly hashService;
    private auditLogger?;
    constructor(userRepository: PrismaUserRepository, hashService: IHashService, auditLogger?: AuditLogger | undefined);
    execute(data: RegisterLoginUserDTO): Promise<any>;
}
//# sourceMappingURL=register-user.usecase.d.ts.map