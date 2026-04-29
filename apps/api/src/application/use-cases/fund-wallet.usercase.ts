import type { PrismaClient } from "../../../generated/prisma/client.js";
import type { ILedgerRepository } from "../../interfaces/ledger-repository.interface.js";
import type { ITransactionRepository } from "../../interfaces/transaction-repository.interface.js";
import type { IWalletRepository } from "../../interfaces/wallet-repository.interface.js";
import type { IdempotencyService } from "../../services/idempotency.service.js";
import type { TransactionLogger } from "../../shared/logger/transaction.logger.js";
import type { UseCase } from "../interfaces/useCase.js";

type FundWalletType = {
  userId: string;
  amount: number;
  reference: string;
  idempotencyKey: string;
  requestHash: string;
};

export class FundWalletUseCase implements UseCase<FundWalletType, any> {
  constructor(
    private walletRepo: IWalletRepository,
    private transactionRepo: ITransactionRepository,
    private ledgerRepo: ILedgerRepository,
    private idempotencyService: IdempotencyService,
    private prisma: PrismaClient,
    private transactionLogger?: TransactionLogger,
  ) {}

  private async executeFundingLogic(input: FundWalletType) {
    if (input.amount <= 0) {
      throw new Error("Invalid amount");
    }

    const wallet = await this.walletRepo.findByUserId(input.userId);

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    return await this.prisma.$transaction(async (tx) => {
      // 1️⃣ Create transaction (business event)
      const transaction = await this.transactionRepo.create({
        userId: input.userId,
        type: "WALLET_FUNDING",
        amount: input.amount,
        reference: input.reference,
      });

      // 2️⃣ Create ledger entries (financial truth)
      const entries = [
        {
          walletId: wallet.id,
          transactionId: transaction.id,
          type: "CREDIT" as const,
          amount: input.amount,
        },
        {
          walletId: "SYSTEM_ACCOUNT",
          transactionId: transaction.id,
          type: "DEBIT" as const,
          amount: input.amount,
        },
      ];

      // 🔒 Safety check (defensive programming)
      const debit = entries.find((e) => e.type === "DEBIT")!.amount;
      const credit = entries.find((e) => e.type === "CREDIT")!.amount;

      if (debit !== credit) {
        throw new Error("Ledger imbalance detected");
      }

      await this.ledgerRepo.createMany(entries);

      // 3️⃣ Update wallet balance (cached layer)
      const newBalance = wallet.balance + input.amount;
      // const updatedWallet = await tx.wallet.update({
      //   where: { id: wallet.id },
      //   data: {
      //     balance: {
      //       increment: input.amount,
      //     },
      //   },
      // });

      const updatedWallet = await this.walletRepo.updateBalance(
        wallet.id,
        newBalance,
      );

      // 4️⃣ Mark transaction success
      await this.transactionRepo.updateStatus(transaction.id, "SUCCESS");

      // 5️⃣ Return response
      return {
        balance: updatedWallet.balance,
        transactionId: transaction.id,
      };
    });
  }

  async execute(input: FundWalletType) {
    // 🔐 Save idempotency result
    // await this.idempotencyRepo.create({
    //   key: input.idempotencyKey,
    //   userId: input.userId,
    //   requestHash: input.requestHash,
    // });
    return this.idempotencyService.handle({
      key: input.idempotencyKey,
      userId: input.userId,
      payload: input,
      handler: async () => {
        return await this.executeFundingLogic(input);
      },
    });
  }
}
