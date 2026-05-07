import { PrismaClient } from "@prisma/client";

export class WalletRepository {
  constructor(private prisma: PrismaClient) {}

  // 🔍 FIND WALLET BY USER ID
  async findByUserId(userId: string) {
    return this.prisma.wallet.findUnique({
      where: { userId },
    });
  }

  // 💰 CREATE WALLET
  async create(data: { userId: string; currency?: string }) {
    return this.prisma.wallet.create({
      data: {
        userId: data.userId,
        currency: data.currency ?? "NGN",
        balance: 0,
      },
    });
  }

  // 📊 UPDATE BALANCE (CACHED VALUE)
  async updateBalance(walletId: string, newBalance: number) {
    return this.prisma.wallet.update({
      where: { id: walletId },
      data: {
        balance: newBalance,
        updatedAt: new Date(),
      },
    });
  }

  // 📊 UPDATE BALANCE (CACHED VALUE)
  async updateSenderReceiverBalance(
    senderWalletId: string,
    senderNewBalance: number,
    recieverWalletId: string,
    receiverNewBalance: number,
  ) {
    const [senderWallet, receiverWallet] = this.prisma.$transaction([
      this.prisma.wallet.update({
        where: { id: senderWalletId },
        data: {
          balance: senderNewBalance,
          updatedAt: new Date(),
        },
      }),
      this.prisma.wallet.update({
        where: { id: recieverWalletId },
        data: {
          balance: receiverNewBalance,
          updatedAt: new Date(),
        },
      }),
    ]);

    return { senderWallet, receiverWallet };
  }

  // ➕ INCREMENT BALANCE (SAFE FUNDING)
  async incrementBalance(walletId: string, amount: number) {
    return this.prisma.wallet.update({
      where: { id: walletId },
      data: {
        balance: {
          increment: amount,
        },
        updatedAt: new Date(),
      },
    });
  }

  // ➖ DECREMENT BALANCE (TRANSFER / SPEND)
  async decrementBalance(walletId: string, amount: number) {
    return this.prisma.wallet.update({
      where: { id: walletId },
      data: {
        balance: {
          decrement: amount,
        },
        updatedAt: new Date(),
      },
    });
  }

  // 🔍 GET ALL WALLETS (USED FOR RECONCILIATION)
  async getAllWallets() {
    return this.prisma.wallet.findMany();
  }
}
