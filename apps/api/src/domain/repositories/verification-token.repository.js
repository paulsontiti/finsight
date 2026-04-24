import prisma from "../../prisma.js";
export class PrismaVerificationTokenRepository {
    async create(data) {
        await prisma.verificationToken.create({
            data: {
                userId: data.userId,
                token: data.token,
                expiresAt: data.expiresAt
            }
        });
    }
    async find(token) {
        return prisma.verificationToken.findFirst({
            where: { token }
        });
    }
    async delete(id) {
        await prisma.verificationToken.delete({
            where: { id }
        });
    }
}
//# sourceMappingURL=verification-token.repository.js.map