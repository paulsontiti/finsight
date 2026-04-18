import jwt from "jsonwebtoken";
import type { ITokenService, UserPayload } from "../types/index.js";

export class JwtService implements ITokenService {
  constructor(private readonly secret: string) {}

  sign(payload: UserPayload): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: "1d"
    });
  }

   verify(token: string): UserPayload {
    return jwt.verify(token, this.secret) as UserPayload;
  }
}