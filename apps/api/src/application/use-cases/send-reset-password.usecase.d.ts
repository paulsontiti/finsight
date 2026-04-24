import type { IGenerator, IMailer, ITokenRepository, IUserRepository } from "../../shared/types/index.js";
import type { UseCase } from "../interfaces/useCase.js";
export declare class SendResetPasswordUseCase implements UseCase<string, {
    success: boolean;
}> {
    private readonly tokenRepo;
    private readonly userRepo;
    private readonly tokenGenerator;
    private readonly mailer;
    constructor(tokenRepo: ITokenRepository, userRepo: IUserRepository, tokenGenerator: IGenerator, mailer: IMailer);
    execute(email: string): Promise<{
        success: boolean;
    }>;
}
//# sourceMappingURL=send-reset-password.usecase.d.ts.map