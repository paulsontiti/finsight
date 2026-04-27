import type { Request, Response, NextFunction } from "express";
import { DatabaseError } from "../shared/erors/system.error.js";
import type { VerifyEmailUseCase } from "../application/use-cases/verify-email.usecase.js";
import {
  InvalidCredentialsError,
  UserNotFoundError,
} from "../shared/erors/domain.errors.js";

export class VerifyEmailController {
  constructor(private readonly verifyEmailUseCase: VerifyEmailUseCase | any) {}

  handle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.query;

      // 🔴 Validation
      if (!token || typeof token !== "string" || token.trim() === "") {
        return res.status(401).json({
          message: "Verification token is required",
        });
      }

      try {
        const result = await this.verifyEmailUseCase.execute(token);
        return res.status(201).json({
          message: result
            ? "Email verified successfully"
            : "Email not verified",
        });
      } catch (err: any) {
        if (err instanceof InvalidCredentialsError) {
          return res.status(401).json({ message: err.message });
        }
        if (err instanceof UserNotFoundError) {
          return res.status(409).json({ message: err.message });
        }
        if (err instanceof DatabaseError) {
          return res.status(501).json({ message: err.message });
        }
        console.log(err.message);
        return res.status(500).json({ message: err.message });
      }
    } catch (err: any) {
      next(err);
    }
    // try {
    //   const { token } = req.query;

    //   // 🔴 Validation
    //   if (!token || typeof token !== "string" || token.trim() === "") {
    //     return res.status(401).json({
    //       message: "Verification token is required"
    //     });
    //   }

    //   const result = await this.verifyEmailUseCase.execute(token.trim());

    //   return res.status(201).json({
    //     message: result?.message || "Email verified successfully"
    //   });
    // } catch (error) {
    //   next(error);
    // }
  };
}
