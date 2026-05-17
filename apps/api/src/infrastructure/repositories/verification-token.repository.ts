import prisma from "../../prisma.js";
import type { ITokenRepository } from "../../shared/types/index.js";

export class PrismaVerificationTokenRepository
  implements ITokenRepository
{
  async create(data: {
    userId: string;
    token: string;
    expiresAt: Date;
  }): Promise<void> {
    await prisma.verificationToken.create({
      data: {
        userId: data.userId,
        token: data.token,
        expiresAt: data.expiresAt
      }
    });
  }

  async find(token: string) {
    return prisma.verificationToken.findFirst({
      where: { token }
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.verificationToken.delete({
      where: { id }
    });
  }
}