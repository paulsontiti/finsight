import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../shared/types/index.js";
import { InvalidCredentialsError, UnauthorizedError } from "../shared/erors/domain.errors.js";

export function roleMiddleware(allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      throw new InvalidCredentialsError("Unauthorized");
    }

    if (!allowedRoles.includes(user.role)) {
      throw new UnauthorizedError("Forbidden");
    }

    next();
  };
}