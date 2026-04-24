import type { IHashService, IRefreshTokenRepository } from "../shared/types/index.js";
export declare class RefreshTokenService {
    private readonly repo;
    private readonly hashService;
    constructor(repo: IRefreshTokenRepository, hashService: IHashService);
    create(userId: string, rawToken: string, expiresAt: Date): Promise<void>;
    validate(userId: string, rawToken: string): Promise<import("../shared/types/index.js").DBRefreshTokenProps | null>;
    revoke(id: string): Promise<void>;
    revokeAll(userId: string): Promise<void>;
}
//# sourceMappingURL=refresh-token.service.d.ts.map