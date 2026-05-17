import { PrismaClient } from "@prisma/client";
import type { ILedgerRepository } from "../../domain/interfaces/ledger-repository.interface.js";

export class PrismaLedgerRepository implements ILedgerRepository {
  constructor(private prisma: PrismaClient) {}
  async findByWalletId(walletId: string) {
    return this.prisma.ledgerEntry.findMany({
      where: {
        walletId,
      },

      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async findAfterDate(walletId: string, date: Date) {
    return this.prisma.ledgerEntry.findMany({
      where: {
        walletId,

        createdAt: {
          gt: date,
        },
      },

      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async createMany(
    entries: {
      walletId: string;
      transactionId: string;
      type: "DEBIT" | "CREDIT";
      amount: number;
    }[],
  ) {
    await this.prisma.ledgerEntry.createMany({
      data: entries,
    });
  }
  async findByTransaction(transactionId: string) {
    return this.prisma.ledgerEntry.findMany({
      where: {
        transactionId,
      },

      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async getEntriesByDateRange(start: string, end: string) {
    return this.prisma.ledgerEntry.findMany({
      where: {
        createdAt: {
          gte: new Date(start),
          lte: new Date(end),
        },
      },
    });
  }

  async create(data: any) {
    return this.prisma.ledgerEntry.create({
      data,
    });
  }
}
