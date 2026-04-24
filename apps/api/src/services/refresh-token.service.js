export class RefreshTokenService {
    repo;
    hashService;
    constructor(repo, hashService) {
        this.repo = repo;
        this.hashService = hashService;
    }
    async create(userId, rawToken, expiresAt) {
        const hashed = await this.hashService.hash(rawToken);
        await this.repo.create({
            userId,
            hashedToken: hashed,
            expiresAt
        });
    }
    async validate(userId, rawToken) {
        const tokens = await this.repo.findByUserId(userId);
        for (const record of tokens) {
            const isValid = await this.hashService.compare(rawToken, record.hashedToken);
            if (isValid) {
                return record;
            }
        }
        return null;
    }
    async revoke(id) {
        await this.repo.delete(id);
    }
    async revokeAll(userId) {
        await this.repo.deleteByUserId(userId);
    }
}
//# sourceMappingURL=refresh-token.service.js.map