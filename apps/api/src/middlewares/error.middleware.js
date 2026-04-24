import { AppError } from "../shared/erors/base.error.js";
export function errorMiddleware(err, req, res, next) {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }
    // unknown error
    return res.status(500).json({
        success: false,
        message: "Internal server error"
    });
}
//# sourceMappingURL=error.middleware.js.map