import type { Request, Response, NextFunction } from "express";
import { AppError } from "../shared/erors/base.error.js";

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
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