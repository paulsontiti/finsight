import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";



const authRouter = Router()

const userController = new AuthController();

authRouter.post("/register",userController.register)
authRouter.post("/login",userController.login)
authRouter.post("/refresh-token",userController.refreshToken)

export default authRouter;