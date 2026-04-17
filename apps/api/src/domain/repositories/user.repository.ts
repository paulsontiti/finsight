import prisma from "../../prisma.js";
import  { type CreateUserProps, type DBUserProps } from "../entities/user.entity.js";

import type { Repository } from "./repository.js";

interface IUserRepository extends Repository<DBUserProps> {
  findByEmail(email: string): Promise<DBUserProps | null>;
}

export class PrismaUserRepository implements IUserRepository {
  async create(data: CreateUserProps):Promise<DBUserProps> {
    return prisma.user.create({
      data,
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email:email.trim().toLowerCase() },
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
