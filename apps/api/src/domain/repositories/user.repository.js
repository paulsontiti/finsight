import prisma from "../../prisma.js";
export class PrismaUserRepository {
    update(data) {
        throw new Error("Method not implemented.");
    }
    async create(data) {
        return prisma.user.create({
            data,
        });
    }
    async findById(id) {
        return prisma.user.findUnique({
            where: { id },
        });
    }
    async findByEmail(email) {
        return prisma.user.findUnique({
            where: { email: email.trim().toLowerCase() },
        });
    }
}
//# sourceMappingURL=user.repository.js.map