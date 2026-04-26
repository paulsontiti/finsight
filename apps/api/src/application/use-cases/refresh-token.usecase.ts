import type { RefreshTokenService } from "../../services/refresh-token.service.js";
import {
  InvalidCredentialsError,
  UnauthorizedError,
} from "../../shared/erors/domain.errors.js";
import type { ITokenService } from "../../shared/types/index.js";
import type { UseCase } from "../interfaces/useCase.js";

export class RefreshTokenUseCase implements UseCase<string, string> {
  constructor(
    private readonly tokenService: ITokenService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async execute(refreshToken: string) {
    if (!refreshToken) {
      throw new InvalidCredentialsError("Refresh token required");
    }

    let payload;
    try {
      payload = this.tokenService.verify(refreshToken);
      const stored = await this.refreshTokenService.validate(
        payload.userId,
        refreshToken,
      );

      if (!stored) {
        throw new UnauthorizedError("Invalid refresh token");
      }
    } catch (err: any) {
      throw new InvalidCredentialsError();
    }
    // generate new access token
    const accessToken = this.tokenService.signAccessToken(payload);

    return accessToken;
  }
}
