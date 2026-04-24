import type { IHashService, ITokenRepository, IUserRepository } from "../../shared/types/index.js";
import type { UseCase } from "../interfaces/useCase.js";
export declare class ResetPasswordUseCase implements UseCase<{
    token: string;
    newPassword: string;
}, {
    reset: boolean;
}> {
    private readonly tokenRepo;
    private readonly userRepo;
    private readonly hashService;
    constructor(tokenRepo: ITokenRepository, userRepo: IUserRepository, hashService: IHashService);
    execute(data: {
        token: string;
        newPassword: string;
    }): Promise<{
        reset: boolean;
    }>;
}
//# sourceMappingURL=reset-password.usecase.d.ts.map