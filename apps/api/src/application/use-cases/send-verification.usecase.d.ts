import type { EmailVerificaionProp, IGenerator, ITokenRepository } from "../../shared/types/index.js";
import type { UseCase } from "../interfaces/useCase.js";
export declare class SendVerificationUseCase implements UseCase<EmailVerificaionProp, {
    success: boolean;
}> {
    private readonly repo;
    private readonly tokenGenerator;
    private readonly mailer;
    constructor(repo: ITokenRepository, tokenGenerator: IGenerator, mailer: any);
    execute(data: EmailVerificaionProp): Promise<{
        success: boolean;
    }>;
}
//# sourceMappingURL=send-verification.usecase.d.ts.map