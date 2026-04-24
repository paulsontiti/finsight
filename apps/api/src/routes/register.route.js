import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { container } from "../shared/container/index.js";
const authRouter = Router();
const auditLogger = container.resolve("auditLogger");
const userController = new UserController();
authRouter.post("/register", userController.register);
export default authRouter;
//# sourceMappingURL=register.route.js.map