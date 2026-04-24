import { AppError } from "./base.error.js";
export declare class UserAlreadyExistsError extends AppError {
    constructor();
}
export declare class BcryptHashError extends AppError {
    constructor();
}
export declare class UserNotFoundError extends AppError {
    constructor();
}
export declare class InvalidCredentialsError extends AppError {
    constructor(message?: string);
}
export declare class UnauthorizedError extends AppError {
    constructor(message?: string);
}
export declare class InsufficientBalanceError extends AppError {
    constructor();
}
//# sourceMappingURL=domain.errors.d.ts.map