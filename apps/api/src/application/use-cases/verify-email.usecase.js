import { InvalidCredentialsError } from "../../shared/erors/domain.errors.js";
export class VerifyEmailUseCase {
    tokenRepo;
    userRepo;
    constructor(tokenRepo, userRepo) {
        this.tokenRepo = tokenRepo;
        this.userRepo = userRepo;
    }
    async execute(token) {
        if (!token) {
            throw new InvalidCredentialsError("Token required");
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
            throw new InvalidCredentialsError("User not found");
        }
        await this.userRepo.update({ isVerified: true });
        await this.tokenRepo.delete(record.id);
        return { verified: true };
    }
}
//# sourceMappingURL=verify-email.usecase.js.map