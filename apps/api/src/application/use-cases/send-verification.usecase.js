export class SendVerificationUseCase {
    repo;
    tokenGenerator;
    mailer;
    constructor(repo, tokenGenerator, mailer) {
        this.repo = repo;
        this.tokenGenerator = tokenGenerator;
        this.mailer = mailer;
    }
    async execute(data) {
        const { userId, email } = data;
        const token = this.tokenGenerator.generate();
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
        await this.repo.create({
            userId,
            token,
            expiresAt
        });
        await this.mailer.send({
            to: email,
            subject: "Verify your account",
            body: `Click to verify: http://localhost:3000/verify?token=${token}`
        });
        return { success: true };
    }
}
//# sourceMappingURL=send-verification.usecase.js.map