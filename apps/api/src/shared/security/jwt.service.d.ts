import type { ITokenService, UserPayload } from "../types/index.js";
export declare class JwtService implements ITokenService {
    private readonly secret;
    constructor(secret: string);
    signAccessToken(payload: UserPayload): string;
    signRefreshToken(payload: UserPayload): string;
    verify(token: string): UserPayload;
}
//# sourceMappingURL=jwt.service.d.ts.map