import type {  Response, NextFunction } from "express";
import type { AuthRequest, ITokenService, UserPayload } from "../shared/types/index.js";
import { InvalidCredentialsError } from "../shared/erors/domain.errors.js";



export function authMiddleware(tokenService: ITokenService) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new InvalidCredentialsError("Unauthorized");
    }

    const [, token] = authHeader.split(" ");

    if (!token) {
      throw new InvalidCredentialsError("Invalid token format");
    }

    try {
      const payload = tokenService.verify(token);

      // attach user to request
      req.user = payload;

      next();
    } catch (error) {
      throw new InvalidCredentialsError("Invalid or expired token");
    }
  };
}