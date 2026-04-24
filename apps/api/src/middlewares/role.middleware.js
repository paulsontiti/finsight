import { InvalidCredentialsError, UnauthorizedError } from "../shared/erors/domain.errors.js";
export function roleMiddleware(allowedRoles) {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            throw new InvalidCredentialsError("Unauthorized");
        }
        if (!allowedRoles.includes(user.role)) {
            throw new UnauthorizedError("Forbidden");
        }
        next();
    };
}
//# sourceMappingURL=role.middleware.js.map