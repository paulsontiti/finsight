import { PrismaClient } from "@prisma/client";
import type { IIdempotencyRepository } from "../../interfaces/idempotency-repository.interface.js";

export class PrismaIdempotencyRepository implements IIdempotencyRepository {
  constructor(private prisma: PrismaClient) {}
  create(data: { key: string; walletId: string; requestHash: string; }): Promise<void> {
    throw new Error("Method not implemented.");
  }
  saveResponse(key: string, walletId: string, response: any): Promise<void> {
    throw new Error("Method not implemented.");
  }
  updateStatus(key: string, walletId: string, status: "PROCESSING" | "COMPLETED" | "FAILED"): Promise<void> {
    throw new Error("Method not implemented.");
  }

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