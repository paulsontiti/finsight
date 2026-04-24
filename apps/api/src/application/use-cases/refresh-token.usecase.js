import { InvalidCredentialsError, UnauthorizedError } from "../../shared/erors/domain.errors.js";
export class RefreshTokenUseCase {
    tokenService;
    refreshTokenService;
    constructor(tokenService, refreshTokenService) {
        this.tokenService = tokenService;
        this.refreshTokenService = refreshTokenService;
    }
    async execute(refreshToken) {
        if (!refreshToken) {
            throw new InvalidCredentialsError("Refresh token required");
        }
        const payload = this.tokenService.verify(refreshToken);
        const stored = await this.refreshTokenService.validate(payload.userId, refreshToken);
        if (!stored) {
            throw new UnauthorizedError("Invalid refresh token");
        }
        // generate new access token
        const accessToken = this.tokenService.signAccessToken(payload);
        return accessToken;
    }
}
//# sourceMappingURL=refresh-token.usecase.js.map