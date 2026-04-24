import type { Response, NextFunction } from "express";
import type { AuthRequest, ITokenService } from "../shared/types/index.js";
export declare function authMiddleware(tokenService: ITokenService): (req: AuthRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map