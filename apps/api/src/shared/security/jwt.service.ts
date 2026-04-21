import jwt from "jsonwebtoken";
import type { ITokenService, UserPayload } from "../types/index.js";

export class JwtService implements ITokenService {
  constructor(private readonly secret: string) {}

  signAccessToken(payload: UserPayload): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: "15m"
    });
  }

  signRefreshToken(payload: UserPayload): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: "7d"
    });
  }

   verify(token: string): UserPayload {
    return jwt.verify(token, this.secret) as UserPayload;
  }
}