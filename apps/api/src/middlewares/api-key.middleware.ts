import type {  Response, NextFunction } from "express";
import type { IApiKeyRepository, AuthRequest } from "../shared/types/index.js";
import { InvalidCredentialsError, UnauthorizedError } from "../shared/erors/domain.errors.js";



export function apiKeyMiddleware(repo: IApiKeyRepository) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const key = req.headers["x-api-key"] as string;

    if (!key) {
      throw new InvalidCredentialsError("API key required");
    }

    const apiKey = await repo.findByKey(key);

    if (!apiKey) {
      throw new UnauthorizedError("Invalid API key");
    }

    req.apiClient = apiKey;

    next();
  };
}