import { InvalidCredentialsError, UnauthorizedError } from "../shared/erors/domain.errors.js";
export function apiKeyMiddleware(repo) {
    return async (req, res, next) => {
        const key = req.headers["x-api-key"];
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
//# sourceMappingURL=api-key.middleware.js.map