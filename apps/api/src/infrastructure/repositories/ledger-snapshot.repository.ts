import { PrismaClient } from "@prisma/client";
import type { ILedgerSnapshotRepository } from "../../domain/interfaces/iLedgerSnapshotRepository.interface.js";

export class PrismaLedgerSnapshotRepository implements ILedgerSnapshotRepository {
  constructor(private prisma: PrismaClient) {}
  findById(
    id: string,
  ): Promise<{
    id: string;
    walletId: string;
    balance: number;
    ledgerCount: number;
    snapshotAt: Date;
    createdAt: Date;
  } | null> {
    throw new Error("Method not implemented.");
  }


  async create(data: {
    walletId: string;
    balance: number;
    ledgerCount: number;
  }) {
    return this.prisma.ledgerSnapshot.create({
      data,
    });
  }


  async findLatestByWallet(walletId: string) {
    return this.prisma.ledgerSnapshot.findFirst({
      where: {
        walletId,
      },

      orderBy: {
        snapshotAt: "desc",
      },
    });
  }


  async findByWallet(walletId: string) {
    return this.prisma.ledgerSnapshot.findMany({
      where: {
        walletId,
      },

      orderBy: {
        snapshotAt: "desc",
      },
    });
  }
}
