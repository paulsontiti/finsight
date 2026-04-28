import type { PrismaClient } from "../../../generated/prisma/client.js";
import type { IIdempotencyRepository } from "../../interfaces/idempotency-repository.interface.js";
import type { ILedgerRepository } from "../../interfaces/ledger-repository.interface.js";
import type { ITransactionRepository } from "../../interfaces/transaction-repository.interface.js";
import type { IWalletRepository } from "../../interfaces/wallet-repository.interface.js";
import type { TransactionLogger } from "../../shared/logger/transaction.logger.js";
import type { UseCase } from "../interfaces/useCase.js";

type FundWalletType ={
    userId: string;
    amount: number;
    reference: string;
    idempotencyKey: string;
  }

export class FundWalletUseCase implements UseCase<FundWalletType,any>{
  constructor(
    private walletRepo: IWalletRepository,
    private transactionRepo: ITransactionRepository,
    private ledgerRepo: ILedgerRepository,
    private idempotencyRepo: IIdempotencyRepository,
    private prisma: PrismaClient,
    private transactionLogger?: TransactionLogger,
  ) {}

  async execute(input: FundWalletType) {
    if (input.amount <= 0) {
      throw new Error("Invalid amount");
    }

    // 🔐 Idempotency check
    const existing = await this.idempotencyRepo.find(input.idempotencyKey);
    if (existing) return existing.response;

    const wallet = await this.walletRepo.findByUserId(input.userId);
    if (!wallet) throw new Error("Wallet not found");

    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Create transaction
      const transaction = await this.transactionRepo.create({
        userId: input.userId,
        type: "WALLET_FUNDING",
        amount: input.amount,
        reference: input.reference,
      });

      // 2. Create ledger entries
      await this.ledgerRepo.createMany([
        {
          walletId: wallet.id,
          transactionId: transaction.id,
          type: "CREDIT",
          amount: input.amount,
        },
        {
          walletId: "SYSTEM_ACCOUNT",
          transactionId: transaction.id,
          type: "DEBIT",
          amount: input.amount,
        },
      ]);

      // 3. Update wallet balance (cache)
      const updatedWallet = await this.walletRepo.updateBalance(
        wallet.id,
        wallet.balance + input.amount,
      );

      // 4. Mark transaction success
      await this.transactionRepo.updateStatus(transaction.id, "SUCCESS");
      this.transactionLogger?.logTransaction({
        transactionId: transaction.id,
        walletId: wallet.id,
        amount: input.amount,
        type: "CREDIT",
        status: "SUCCESS",
      });

      return {
        balance: updatedWallet.balance,
      };
    });

    // 🔐 Save idempotency result
    await this.idempotencyRepo.save(input.idempotencyKey, result);

    return result;
  }
}
