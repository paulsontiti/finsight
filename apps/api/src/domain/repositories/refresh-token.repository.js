import prisma from "../../prisma.js";
export class PrismaRefreshTokenRepository {
    async create(data) {
        await prisma.refreshToken.create({
            data: {
                userId: data.userId,
                hashedToken: data.hashedToken,
                expiresAt: data.expiresAt
            }
        });
    }
    async findByUserId(userId) {
        return prisma.refreshToken.findMany({
            where: { userId }
        });
    }
    async delete(id) {
        await prisma.refreshToken.delete({
            where: { id }
        });
    }
    async deleteByUserId(userId) {
        await prisma.refreshToken.deleteMany({
            where: { userId }
        });
    }
}
//# sourceMappingURL=refresh-token.repository.js.map