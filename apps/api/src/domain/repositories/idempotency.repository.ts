import { PrismaClient } from "@prisma/client";
import type { IIdempotencyRepository } from "../../interfaces/idempotency-repository.interface.js";

export class PrismaIdempotencyRepository implements IIdempotencyRepository {
  constructor(private prisma: PrismaClient) {}

  async find(key: string) {
    const record = await this.prisma.idempotency.findUnique({
      where: { key }
    });

    if (!record) return null;

    return {
      response: record.response
    };
  }

  async save(key: string, response: any) {
    await this.prisma.idempotency.create({
      data: {
        key,
        response
      }
    });
  }
}