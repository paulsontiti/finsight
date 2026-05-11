import { PrismaClient } from "@prisma/client";
import type { ITransactionRepository } from "../../interfaces/transaction-repository.interface.js";

// export class PrismaTransactionRepository implements ITransactionRepository {
//   constructor(private prisma: PrismaClient) {}

//   async create(data: {
//     userId: string;
//     type: string;
//     amount: number;
//     reference: string;
//   }) {
//     const tx = await this.prisma.transaction.create({
//       data: {
//         userId: data.userId,
//         type: data.type,
//         amount: data.amount,
//         reference: data.reference,
//         status: "PENDING"
//       }
//     });

//     return { id: tx.id };
//   }

//   async updateStatus(id: string, status: "PENDING" | "SUCCESS" | "FAILED") {
//     await this.prisma.transaction.update({
//       where: { id },
//       data: { status }
//     });
//   }

//   async findByReference(reference: string) {
//     return this.prisma.transaction.findUnique({
//       where: { reference }
//     });
//   }
// }



export class PrismaTransactionRepository implements ITransactionRepository {
  constructor(private prisma: PrismaClient) {}

  // 🚀 1. COUNT RECENT TRANSACTIONS (VELOCITY CHECK)
  async countRecentByUser(userId: string, seconds: number) {
    const since = new Date(
      Date.now() - seconds * 1000,
    );

    return this.prisma.transaction.count({
      where: {
        walletId: userId,
        createdAt: {
          gte: since,
        },
      },
    });
  }

  // 💰 2. GET USER AVERAGE TRANSACTION AMOUNT
  async getUserAverageAmount(userId: string) {
    const result =
      await this.prisma.transaction.aggregate({
        where: {
          walletId: userId,
        },
        _avg: {
          amount: true,
        },
      });

    return result._avg.amount ?? 0;
  }

  // 🔁 3. FIND RECENT TRANSFERS (CIRCULAR DETECTION)
  async findRecentTransfers(userId: string) {
    const since = new Date(
      Date.now() - 24 * 60 * 60 * 1000,
    ); // last 24 hours

    return this.prisma.transaction.findMany({
      where: {
        walletId: userId,
        createdAt: {
          gte: since,
        },
        type: "TRANSFER",
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        walletId: true,
        amount: true,
        createdAt: true,
      },
    });
  }


  // =========================
  // 🟢 CREATE
  // =========================
  async create(data: {
    walletId: string;
    type: string;
    amount: number;
    reference: string;
    description?: string;
  }) {
    const tx = await this.prisma.transaction.create({
      data: {
        walletId: data.walletId,
        type: data.type,
        amount: data.amount,
        reference: data.reference,
        description: data.description,
        status: "PENDING"
      }
    });

    return { id: tx.id };
  }

  // =========================
  // 🔄 UPDATE STATUS
  // =========================
  async updateStatus(
    id: string,
    status: "PENDING" | "SUCCESS" | "FAILED"
  ) {
    await this.prisma.transaction.update({
      where: { id },
      data: { status }
    });
  }

  // =========================
  // 🔍 FIND BY REFERENCE
  // =========================
  async findByReference(reference: string) {
    return this.prisma.transaction.findUnique({
      where: { reference }
    });
  }

  // =========================
  // 📊 HISTORY
  // =========================
  async findMany(params: {
    walletId: string;
    page: number;
    limit: number;
    type?: string;
    status?: string;
    fromDate?: Date;
    toDate?: Date;
  }) {
    const { walletId, page, limit, type, status, fromDate, toDate } = params;

    const skip = (page - 1) * limit;

    const where: any = {
      walletId
    };

    if (type) where.type = type;
    if (status) where.status = status;

    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) where.createdAt.gte = fromDate;
      if (toDate) where.createdAt.lte = toDate;
    }

    const [data, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc"
        }
      }),
      this.prisma.transaction.count({ where })
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

 
  async getByDateRange(start: string, end: string) {
    return this.prisma.transaction.findMany({
      where: {
        createdAt: {
          gte: new Date(start),
          lte: new Date(end)
        }
      }
    });
  }


}