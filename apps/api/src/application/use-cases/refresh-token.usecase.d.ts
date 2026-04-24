import type { RefreshTokenService } from "../../services/refresh-token.service.js";
import type { ITokenService } from "../../shared/types/index.js";
import type { UseCase } from "../interfaces/useCase.js";
export declare class RefreshTokenUseCase implements UseCase<string, string> {
    private readonly tokenService;
    private readonly refreshTokenService;
    constructor(tokenService: ITokenService, refreshTokenService: RefreshTokenService);
    execute(refreshToken: string): Promise<string>;
}
//# sourceMappingURL=refresh-token.usecase.d.ts.map