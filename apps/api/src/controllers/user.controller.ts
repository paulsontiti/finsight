import type { Request, Response } from "express";
import { container } from "../shared/container/index.js";
import type { RegisterUserUseCase } from "../application/use-cases/register-user.usecase.js";
import type { LoginUserUseCase } from "../application/use-cases/login-user.usecase.js";

export class AuthController {
  async register(req: Request, res: Response) {
    const useCase = container.resolve<RegisterUserUseCase>(
      "registerUserUseCase",
    );

    const result = await useCase.execute(req.body);

    return res.status(201).json(result);
  }

  async login(req: Request, res: Response) {
    const useCase = container.resolve<LoginUserUseCase>("loginUserUseCase");

    const result = await useCase.execute(req.body);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true, // prevents JS access
      secure: true, // only HTTPS (VERY IMPORTANT in production)
      sameSite: "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json(result);
  }
}
