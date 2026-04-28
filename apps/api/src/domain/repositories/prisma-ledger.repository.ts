import { PrismaClient } from "@prisma/client";
import type { ILedgerRepository } from "../../interfaces/ledger-repository.interface.js";

export class PrismaLedgerRepository implements ILedgerRepository {
  constructor(private prisma: PrismaClient) {}

  async createMany(entries: {
    walletId: string;
    transactionId: string;
    type: "DEBIT" | "CREDIT";
    amount: number;
  }[]) {
    await this.prisma.ledgerEntry.createMany({
      data: entries
    });
  }

  async findByWalletId(walletId: string) {
    return this.prisma.ledgerEntry.findMany({
      where: { walletId }
    });
  }
}