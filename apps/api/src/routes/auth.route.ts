import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { VerifyEmailController } from "../controllers/verify-email.controller.js";
import type { VerifyEmailUseCase } from "../application/use-cases/verify-email.usecase.js";
import { container } from "../shared/container/index.js";



const authRouter = Router()

const userController = new AuthController();

              const useCase =
        container.resolve<VerifyEmailUseCase>("verifyEmailUseCase");

      
const verifyEmailController = new VerifyEmailController(useCase)

authRouter.post("/register",userController.register)
authRouter.post("/login",userController.login)
authRouter.post("/refresh-token",userController.refreshToken)
authRouter.get("/verify",verifyEmailController.handle)

export default authRouter;