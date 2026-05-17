import prisma from "../../prisma.js";
import type { CreateRefreshTokenProps, IRefreshTokenRepository } from "../../shared/types/index.js";


export class PrismaRefreshTokenRepository implements IRefreshTokenRepository {

  async create(data: CreateRefreshTokenProps): Promise<void> {
    await prisma.refreshToken.create({
      data: {
        userId: data.userId,
        hashedToken: data.hashedToken,
        expiresAt: data.expiresAt
      }
    });
  }

  async findByUserId(userId: string) {
    return prisma.refreshToken.findMany({
      where: { userId }
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.refreshToken.delete({
      where: { id }
    });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { userId }
    });
  }
}