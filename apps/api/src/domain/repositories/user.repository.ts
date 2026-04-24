import prisma from "../../prisma.js";
import type {
  CreateUserProps,
  DBUserProps,
  IUserRepository,
} from "../../shared/types/index.js";

export class PrismaUserRepository implements IUserRepository {
  update(data: any): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async create(data: CreateUserProps): Promise<any> {
    
      return prisma.user.create({
        data,
      });
  }

  async findById(id: string): Promise<any | null> {
      return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<DBUserProps | null> {
    return prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
  }

  // =========================
  // MAPPER
  // =========================

  // private toDomain(data: any): DBUser {
  //   return new DBUser({
  //     id: data.id,
  //     email: data.email,
  //     password: data.password,
  //     createdAt: data.createdAt,
  //     updatedAt: data.updatedAt
  //   });
  // }
}
