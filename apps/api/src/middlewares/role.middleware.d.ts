import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../shared/types/index.js";
export declare function roleMiddleware(allowedRoles: string[]): (req: AuthRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=role.middleware.d.ts.map