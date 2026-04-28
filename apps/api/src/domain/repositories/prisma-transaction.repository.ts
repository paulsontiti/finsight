import { PrismaClient } from "@prisma/client";
import type { ITransactionRepository } from "../../interfaces/transaction-repository.interface.js";

export class PrismaTransactionRepository implements ITransactionRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: {
    userId: string;
    type: string;
    amount: number;
    reference: string;
  }) {
    const tx = await this.prisma.transaction.create({
      data: {
        userId: data.userId,
        type: data.type,
        amount: data.amount,
        reference: data.reference,
        status: "PENDING"
      }
    });

    return { id: tx.id };
  }

  async updateStatus(id: string, status: "PENDING" | "SUCCESS" | "FAILED") {
    await this.prisma.transaction.update({
      where: { id },
      data: { status }
    });
  }

  async findByReference(reference: string) {
    return this.prisma.transaction.findUnique({
      where: { reference }
    });
  }
}