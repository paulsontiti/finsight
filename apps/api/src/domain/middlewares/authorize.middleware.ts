import type { AuthRequest } from "../../shared/types/index.js";

export const authorizeMiddleware =
  (...roles: string[]) =>
  (req: AuthRequest, res: any, next: any) => {
    if (!roles.includes(req.user?.role as string)) {
      return res.status(403).send("Forbidden");
    }

    next();
  };
