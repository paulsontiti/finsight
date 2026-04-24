import type { ITokenRepository } from "../../shared/types/index.js";
export declare class PrismaVerificationTokenRepository implements ITokenRepository {
    create(data: {
        userId: string;
        token: string;
        expiresAt: Date;
    }): Promise<void>;
    find(token: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
    } | null>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=verification-token.repository.d.ts.map