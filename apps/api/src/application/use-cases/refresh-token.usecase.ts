
import type { RefreshTokenService } from "../../services/refresh-token.service.js";
import { InvalidCredentialsError, UnauthorizedError } from "../../shared/erors/domain.errors.js";
import type { ITokenService } from "../../shared/types/index.js";
import type { UseCase } from "../interfaces/useCase.js";


export class RefreshTokenUseCase implements UseCase<string,string>{
  constructor(
    private readonly tokenService: ITokenService,
    private readonly refreshTokenService: RefreshTokenService
  ) {}

  async execute(refreshToken: string) {
    if (!refreshToken) {
      throw new InvalidCredentialsError("Refresh token required");
    }

    const payload = this.tokenService.verify(refreshToken);

    const stored = await this.refreshTokenService.validate(payload.user?.userId,refreshToken);

    if (!stored) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    // generate new access token
    const accessToken = this.tokenService.signAccessToken({
      user: payload.user
    });

    return accessToken;
  }
}