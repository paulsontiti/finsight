import type { Request, Response, NextFunction } from "express";
import type { SendResetPasswordUseCase } from "../application/use-cases/send-reset-password.usecase.js";

export class ForgotPasswordController {
  constructor(private readonly useCase: SendResetPasswordUseCase) {}

  handle = async(req: Request, res: Response, next: NextFunction) =>{
    try {
      const { email } = req.body;

      if (!email || typeof email !== "string") {
        return res.status(400).json({
          message: "Email is required"
        });
      }

        await this.useCase.execute(email.trim().toLowerCase());

      return res.status(200).json({
        message: "Password reset email sent"
      });
    } catch (error:any) {
      next(error);
    }
  }
}