import { InvalidCredentialsError } from "../shared/erors/domain.errors.js";
export function authMiddleware(tokenService) {
    return (req, res, next) => {
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
        }
        catch (error) {
            throw new InvalidCredentialsError("Invalid or expired token");
        }
    };
}
//# sourceMappingURL=auth.middleware.js.map