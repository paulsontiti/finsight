import prisma from "../../prisma.js";
import type { ITokenRepository } from "../../shared/types/index.js";


export class PrismaPasswordResetTokenRepository implements ITokenRepository {
  async create(data: {
    userId: string;
    token: string;
    expiresAt: Date;
  }) {
    await prisma.passwordResetToken.create({
      data
    });
  }

  async find(token: string) {
    return prisma.passwordResetToken.findFirst({
      where: { token }
    });
  }

  async delete(id: string) {
    await prisma.passwordResetToken.delete({
      where: { id }
    });
  }
}