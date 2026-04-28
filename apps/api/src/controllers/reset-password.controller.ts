import type { Request, Response, NextFunction } from "express";
import type { ResetPasswordUseCase } from "../application/use-cases/reset-password.usecase.js";
import { ValidationsService } from "../services/validations-service.js";
import {
  InvalidCredentialsError,
  UserNotFoundError,
} from "../shared/erors/domain.errors.js";
import { DatabaseError } from "../shared/erors/system.error.js";

export class ResetPasswordController {
  constructor(private readonly useCase: ResetPasswordUseCase) {}

  handle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { token, password } = req.body;

      if (!token || typeof token !== "string") {
        return res.status(400).json({
          message: "Token is required",
        });
      }

      //validate password
      try {
        password = ValidationsService.validatePassword(password);
      } catch (err: any) {
        return res.status(400).json({
          message: "Valid password required",
        });
      }
      // if (!password || password.length < 6) {
      //   return res.status(400).json({
      //     message: "Valid password required",
      //   });
      // }

      await this.useCase.execute({ token, newPassword: password });

      return res.status(200).json({
        message: "Password reset successful",
      });
    } catch (err: any) {
      if (err instanceof InvalidCredentialsError) {
        return res.status(401).json({
          message: "Invalid Token",
        });
      }
      if (err instanceof UserNotFoundError) {
        return res.status(409).json({
          message: "No User record",
        });
      }
      if (err instanceof DatabaseError) {
        return res.status(501).json({
          message: err.message,
        });
      }
      next(err);
    }
  };
}
