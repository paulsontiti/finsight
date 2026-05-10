import { PrismaClient } from "@prisma/client";

export class WalletRepository {
  constructor(private prisma: PrismaClient) {}

  // =========================================================
  //  FIND WALLET
  // =========================================================

  async findByUserId(userId: string) {
    return this.prisma.wallet.findUnique({
      where: { userId },
    });
  }

  async findById(walletId: string) {
    return this.prisma.wallet.findUnique({
      where: { id: walletId },
    });
  }

  // =========================================================
  //  CREATE WALLET
  // =========================================================

  async create(data: { userId: string; currency?: string }) {
    return this.prisma.wallet.create({
      data: {
        userId: data.userId,
        currency: data.currency ?? "NGN",

        // Cached balance
        balance: 0,

        // Optimistic locking version
        version: 1,
      },
    });
  }

  // =========================================================
  //  SAFE CREDIT (CONCURRENCY SAFE)
  // =========================================================

  async safeCredit(walletId: string, amount: number, currentVersion: number) {
    const updated = await this.prisma.wallet.updateMany({
      where: {
        id: walletId,
        version: currentVersion,
      },

      data: {
        balance: {
          increment: amount,
        },

        version: {
          increment: 1,
        },

        updatedAt: new Date(),
      },
    });

    if (updated.count === 0) {
      throw new Error("Concurrent modification detected");
    }

    return this.findById(walletId);
  }

  // =========================================================
  //  SAFE DEBIT (DOUBLE-SPENDING SAFE)
  // =========================================================

  async safeDebit(walletId: string, amount: number, currentVersion: number) {
    const updated = await this.prisma.wallet.updateMany({
      where: {
        id: walletId,

        // Optimistic locking
        version: currentVersion,

        // Prevent overspending
        balance: {
          gte: amount,
        },
      },

      data: {
        balance: {
          decrement: amount,
        },

        version: {
          increment: 1,
        },

        updatedAt: new Date(),
      },
    });

    if (updated.count === 0) {
      throw new Error("Insufficient balance or concurrent update");
    }

    return this.findById(walletId);
  }

  // =========================================================
  //  SAFE TRANSFER
  // =========================================================

  async safeTransfer(
    senderWalletId: string,
    receiverWalletId: string,
    amount: number,
  ) {
    return this.prisma.$transaction(async (tx: any) => {
      // ---------------------------------------------
      // 1. Load latest wallets
      // ---------------------------------------------

      const senderWallet = await tx.wallet.findUnique({
        where: {
          id: senderWalletId,
        },
      });

      const receiverWallet = await tx.wallet.findUnique({
        where: {
          id: receiverWalletId,
        },
      });

      if (!senderWallet) {
        throw new Error("Sender wallet not found");
      }

      if (!receiverWallet) {
        throw new Error("Receiver wallet not found");
      }

      // ---------------------------------------------
      // 2. Prevent self transfer
      // ---------------------------------------------

      if (senderWallet.id === receiverWallet.id) {
        throw new Error("Cannot transfer to same wallet");
      }

      // ---------------------------------------------
      // 3. SAFE DEBIT
      // ---------------------------------------------

      const debitResult = await this.safeDebit(
        senderWalletId,
        amount,
        senderWallet.version,
      );
      // tx.wallet.updateMany({
      //   where: {
      //     id: senderWallet.id,

      //     version: senderWallet.version,

      //     balance: {
      //       gte: amount,
      //     },
      //   },

      //   data: {
      //     balance: {
      //       decrement: amount,
      //     },

      //     version: {
      //       increment: 1,
      //     },

      //     updatedAt: new Date(),
      //   },
      // });

      if (debitResult.count === 0) {
        throw new Error("Concurrent update or insufficient balance");
      }

      // ---------------------------------------------
      // 4. SAFE CREDIT
      // ---------------------------------------------

      const creditResult = await this.safeCredit(
        receiverWalletId,
        amount,
        receiverWallet.version,
      );
      // tx.wallet.updateMany({
      //   where: {
      //     id: receiverWallet.id,
      //     version: receiverWallet.version,
      //   },

      //   data: {
      //     balance: {
      //       increment: amount,
      //     },

      //     version: {
      //       increment: 1,
      //     },

      //     updatedAt: new Date(),
      //   },
      // });

      if (creditResult.count === 0) {
        throw new Error("Receiver wallet modified concurrently");
      }

      // ---------------------------------------------
      // 5. Return fresh state
      // ---------------------------------------------

      const updatedSender = await this.findById(senderWalletId);
      // tx.wallet.findUnique({
      //   where: {
      //     id: senderWallet.id,
      //   },
      // });

      const updatedReceiver = await this.findById(receiverWalletId);
      // tx.wallet.findUnique({
      //   where: {
      //     id: receiverWallet.id,
      //   },
      // });

      return {
        senderWallet: updatedSender,
        receiverWallet: updatedReceiver,
      };
    });
  }

  // =========================================================
  //  LEGACY BALANCE UPDATE
  // (Avoid for critical money movement)
  // =========================================================

  async updateBalance(walletId: string, newBalance: number) {
    return this.prisma.wallet.update({
      where: {
        id: walletId,
      },

      data: {
        balance: newBalance,

        // Increment version because state changed
        version: {
          increment: 1,
        },

        updatedAt: new Date(),
      },
    });
  }

  // =========================================================
  //  GET ALL WALLETS
  // =========================================================

  async getAllWallets() {
    return this.prisma.wallet.findMany();
  }

  async getSenderReceiverWallets(
    senderWalletId: string,
    receiverWalletId: string,
  ) {
    const [senderWallet, receiverWallet] = await Promise.all([
      await this.findById(senderWalletId),
      await this.findById(receiverWalletId),
    ]);

    return { senderWallet, receiverWallet };
  }
}
