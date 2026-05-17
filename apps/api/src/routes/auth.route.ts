import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { VerifyEmailController } from "../controllers/verify-email.controller.js";
import type { VerifyEmailUseCase } from "../application/use-cases/verify-email.usecase.js";
import { container } from "../shared/container/index.js";
import { ResetPasswordController } from "../controllers/reset-password.controller.js";
import type { ResetPasswordUseCase } from "../application/use-cases/reset-password.usecase.js";
import { ForgotPasswordController } from "../controllers/forgot-password.js";
import type { SendResetPasswordUseCase } from "../application/use-cases/send-reset-password.usecase.js";
import type { ValidationsService } from "../services/validations-service.js";
import { authLimiter } from "../domain/middlewares/auth-rate-limit.js";
import { authorizeMiddleware } from "../domain/middlewares/authorize.middleware.js";

const authRouter = Router();

const userController = new AuthController();

const verifyEmailUseCaseseCase =
  container.resolve<VerifyEmailUseCase>("verifyEmailUseCase");
const verifyEmailController = new VerifyEmailController(
  verifyEmailUseCaseseCase,
);

const resetPasswordUserUseCase = container.resolve<ResetPasswordUseCase>(
  "resetPasswordUserUseCase",
);

const resetPasswordController = new ResetPasswordController(
  resetPasswordUserUseCase,
);
const sendResetPasswordUserUseCase =
  container.resolve<SendResetPasswordUseCase>("sendResetPasswordUserUseCase");
const forgotPasswordController = new ForgotPasswordController(
  sendResetPasswordUserUseCase,
);

authRouter.post("/register", userController.register);
authRouter.post("/login", authLimiter, userController.login);
authRouter.post(
  "/refresh-token",
  authorizeMiddleware("APPUSER"),
  userController.refreshToken,
);
authRouter.get(
  "/verify",
  authorizeMiddleware("APPUSER"),
  verifyEmailController.handle,
);
authRouter.post(
  "/reset-password",
  authorizeMiddleware("APPUSER"),
  resetPasswordController.handle,
);
authRouter.post("/forgot-password", forgotPasswordController.handle);

export default authRouter;
