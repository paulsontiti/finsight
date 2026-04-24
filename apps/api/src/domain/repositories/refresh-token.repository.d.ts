import type { CreateRefreshTokenProps, IRefreshTokenRepository } from "../../shared/types/index.js";
export declare class PrismaRefreshTokenRepository implements IRefreshTokenRepository {
    create(data: CreateRefreshTokenProps): Promise<void>;
    findByUserId(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        hashedToken: string;
        expiresAt: Date;
    }[]>;
    delete(id: string): Promise<void>;
    deleteByUserId(userId: string): Promise<void>;
}
//# sourceMappingURL=refresh-token.repository.d.ts.map