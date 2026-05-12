import type { PrismaLedgerRepository } from "../domain/repositories/prisma-ledger.repository.js";
import type { PrismaTransactionRepository } from "../domain/repositories/prisma-transaction.repository.js";

export class TransactionRecoveryService {
  constructor(
    private transactionRepo: PrismaTransactionRepository,
    private ledgerRepo: PrismaLedgerRepository,
  ) {}

  async recoverIncompleteTransactions() {
    const pendingTransactions =
      await this.transactionRepo.findPending();

    for (const tx of pendingTransactions) {
      const ledgerEntries =
        await this.ledgerRepo.findByTransaction(
          tx.id,
        );

      //  NO LEDGER = FAILED
      if (
        ledgerEntries.length === 0
      ) {
        await this.transactionRepo.updateStatus(
          tx.id,
          "FAILED",
        );
      }
    }
  }
}