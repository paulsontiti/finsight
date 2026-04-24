import { InvalidCredentialsError, UserNotFoundError } from "../../shared/erors/domain.errors.js";
export class ResetPasswordUseCase {
    tokenRepo;
    userRepo;
    hashService;
    constructor(tokenRepo, userRepo, hashService) {
        this.tokenRepo = tokenRepo;
        this.userRepo = userRepo;
        this.hashService = hashService;
    }
    async execute(data) {
        const { token, newPassword } = data;
        if (!token || !newPassword) {
            throw new InvalidCredentialsError("Token and password required");
        }
        const record = await this.tokenRepo.find(token);
        if (!record) {
            throw new InvalidCredentialsError("Invalid token");
        }
        if (record.expiresAt < new Date()) {
            throw new InvalidCredentialsError("Token expired");
        }
        const user = await this.userRepo.findById(record.userId);
        if (!user) {
            throw new UserNotFoundError();
        }
        const hashedPassword = await this.hashService.hash(newPassword);
        //user.setPassword(hashedPassword);
        await this.userRepo.update({ password: hashedPassword });
        await this.tokenRepo.delete(record.id);
        return { reset: true };
    }
}
//# sourceMappingURL=reset-password.usecase.js.map