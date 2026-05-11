import type { Request, Response } from "express";
import { container } from "../shared/container/index.js";
import type { RegisterUserUseCase } from "../application/use-cases/register-user.usecase.js";
import type { LoginUserUseCase } from "../application/use-cases/login-user.usecase.js";
import type { RefreshTokenUseCase } from "../application/use-cases/refresh-token.usecase.js";
import {
  InvalidCredentialsError,
  UnauthorizedError,
} from "../shared/erors/domain.errors.js";

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
      const ip =
    req.headers["x-forwarded-for"] ||    req.socket.remoteAddress;

   
  const userAgent =
    req.headers["user-agent"] as string;

  const { email, password, deviceId } =
    req.body;

    const result = await useCase.execute({ip:ip as string,userAgent,email,password,deviceId});

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true, // prevents JS access
      secure: true, // only HTTPS (VERY IMPORTANT in production)
      sameSite: "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json(result);
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const useCase = container.resolve<RefreshTokenUseCase>(
        "refreshTokenUseCase",
      );

      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({ message: "No token" });
      }

      try {
        const accessToken = await useCase.execute(refreshToken);
        return res.status(201).json({ accessToken });
      } catch (err: any) {
        if (err instanceof InvalidCredentialsError) {
          return res.status(401).json({ message: err.message });
        }
        if (err instanceof UnauthorizedError) {
          return res.status(403).json({ message: "Unautorised access" });
        }
      }
    } catch (error: any) {
      if (error instanceof UnauthorizedError) {
        return res.status(403).json({ message: "Unautorised access" });
      }
      return res.status(200).json({ message: "Internal error" });
    }
  }

  // async verify(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const { token } = req.query;

  //     // 🔴 Validation
  //     if (!token || typeof token !== "string" || token.trim() === "") {
  //       return res.status(401).json({
  //         message: "Verification token is required",
  //       });
  //     }

  //     const useCase =
  //       container.resolve<VerifyEmailUseCase>("verifyEmailUseCase");

  //     try {
  //       const result = await useCase.execute(token);
  //       return res.status(201).json({
  //         message: result
  //           ? "Email verified successfully"
  //           : "Email not verified",
  //       });
  //     } catch (err: any) {
  //       if (err instanceof InvalidCredentialsError) {
  //         return res.status(401).json({ message: err.message });
  //       }
  //       if (err instanceof UserNotFoundError) {
  //         return res.status(409).json({ message: err.message });
  //       }
  //       if (err instanceof DatabaseError) {
  //         return res.status(501).json({ message: err.message });
  //       }

  //       return res.status(500).json({ message: err.message });
  //     }
  //   } catch (err: any) {
  //     return res.status(500).json({ message: err.message });
  //   }
  // }
}
