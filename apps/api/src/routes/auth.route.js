import { Router } from "express";
import { AuthController } from "../controllers/user.controller.js";
const authRouter = Router();
const userController = new AuthController();
authRouter.post("/register", userController.register);
authRouter.post("/login", userController.login);
export default authRouter;
//# sourceMappingURL=auth.route.js.map