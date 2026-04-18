import jwt from "jsonwebtoken";
import type { ITokenService } from "../types/index.js";

export class JwtService implements ITokenService {
  constructor(private readonly secret: string) {}

  sign(payload: any): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: "1d"
    });
  }
}