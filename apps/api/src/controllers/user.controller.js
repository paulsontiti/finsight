import { container } from "../shared/container/index.js";
export class AuthController {
    async register(req, res) {
        const useCase = container.resolve("registerUserUseCase");
        const result = await useCase.execute(req.body);
        return res.status(201).json(result);
    }
    async login(req, res) {
        const useCase = container.resolve("loginUserUseCase");
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
//# sourceMappingURL=user.controller.js.map