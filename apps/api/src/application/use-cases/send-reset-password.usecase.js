import { UserNotFoundError } from "../../shared/erors/domain.errors.js";
export class SendResetPasswordUseCase {
    tokenRepo;
    userRepo;
    tokenGenerator;
    mailer;
    constructor(tokenRepo, userRepo, tokenGenerator, mailer) {
        this.tokenRepo = tokenRepo;
        this.userRepo = userRepo;
        this.tokenGenerator = tokenGenerator;
        this.mailer = mailer;
    }
    async execute(email) {
        const user = await this.userRepo.findByEmail(email);
        if (!user) {
            throw new UserNotFoundError();
        }
        const token = this.tokenGenerator.generate();
        const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 mins
        //const hashedToken = await this.hashService.hash(token);
        await this.tokenRepo.create({
            userId: user.id,
            token,
            expiresAt
        });
        await this.mailer.send({
            to: email,
            subject: "Reset your password",
            body: `Reset link: http://localhost:3000/reset-password?token=${token}`
        });
        return { success: true };
    }
}
//# sourceMappingURL=send-reset-password.usecase.js.map