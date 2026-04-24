export declare abstract class AppError extends Error {
    readonly statusCode: number;
    readonly isOperational: boolean;
    constructor(message: string, statusCode: number, isOperational?: boolean);
}
//# sourceMappingURL=base.error.d.ts.map