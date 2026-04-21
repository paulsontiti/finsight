import type { IHashService, IRefreshTokenRepository } from "../shared/types/index.js";

export class RefreshTokenService {
  constructor(
    private readonly repo: IRefreshTokenRepository,
    private readonly hashService: IHashService
  ) {}

  async create(userId: string, rawToken: string, expiresAt: Date) {
    const hashed = await this.hashService.hash(rawToken);

    await this.repo.create({
      userId,
      hashedToken: hashed,
      expiresAt
    });
  }

  async validate(userId: string, rawToken: string) {
    const tokens = await this.repo.findByUserId(userId);

    for (const record of tokens) {
      const isValid = await this.hashService.compare(
        rawToken,
        record.hashedToken
      );

      if (isValid) {
        return record;
      }
    }

    return null;
  }

  async revoke(id: string) {
    await this.repo.delete(id);
  }

  async revokeAll(userId: string) {
    await this.repo.deleteByUserId(userId);
  }
}