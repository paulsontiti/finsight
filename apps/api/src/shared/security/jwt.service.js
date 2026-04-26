import jwt from "jsonwebtoken";
export class JwtService {
    secret;
    constructor(secret) {
        this.secret = secret;
    }
    signAccessToken(payload) {
        return jwt.sign({ userId: payload.userId }, this.secret, {
            expiresIn: "15m",
        });
    }
    signRefreshToken(payload) {
        return jwt.sign(payload, this.secret, {
            expiresIn: "7d",
        });
    }
    verify(token) {
        return jwt.verify(token, this.secret);
    }
}
//# sourceMappingURL=jwt.service.js.map