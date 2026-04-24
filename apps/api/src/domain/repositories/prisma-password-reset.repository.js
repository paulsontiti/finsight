import prisma from "../../prisma.js";
export class PrismaPasswordResetTokenRepository {
    async create(data) {
        await prisma.passwordResetToken.create({
            data
        });
    }
    async find(token) {
        return prisma.passwordResetToken.findFirst({
            where: { token }
        });
    }
    async delete(id) {
        await prisma.passwordResetToken.delete({
            where: { id }
        });
    }
}
//# sourceMappingURL=prisma-password-reset.repository.js.map