import type { Response, NextFunction } from "express";
import type { IApiKeyRepository, AuthRequest } from "../shared/types/index.js";
export declare function apiKeyMiddleware(repo: IApiKeyRepository): (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=api-key.middleware.d.ts.map