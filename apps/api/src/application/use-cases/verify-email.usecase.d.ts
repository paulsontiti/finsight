import type { ITokenRepository, IUserRepository } from "../../shared/types/index.js";
import type { UseCase } from "../interfaces/useCase.js";
export declare class VerifyEmailUseCase implements UseCase<string, {
    verified: boolean;
}> {
    private readonly tokenRepo;
    private readonly userRepo;
    constructor(tokenRepo: ITokenRepository, userRepo: IUserRepository);
    execute(token: string): Promise<{
        verified: boolean;
    }>;
}
//# sourceMappingURL=verify-email.usecase.d.ts.map