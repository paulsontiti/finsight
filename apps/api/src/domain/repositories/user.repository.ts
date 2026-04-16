import prisma from "../../prisma.js";
import type { Repository } from "./repository.js";

type UserType = {}

export class UserRepository implements Repository<UserType>{
  async create(data: { email: string; password: string }) {
    return prisma.user.create({
      data
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id }
    });
  }
}