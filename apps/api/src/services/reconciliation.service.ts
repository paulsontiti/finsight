import type { PrismaLedgerRepository } from "../domain/repositories/prisma-ledger.repository.js";
import type { PrismaTransactionRepository } from "../domain/repositories/prisma-transaction.repository.js";
import type { WalletRepository } from "../domain/repositories/wallet.repository.js";

export class ReconciliationService {
  constructor(
    private ledgerRepo: PrismaLedgerRepository,
    private transactionRepo: PrismaTransactionRepository,
    private walletRepo: WalletRepository
  ) {}

  // 🔍 MAIN RECONCILIATION
  async reconcile(startDate: string, endDate: string) {
    const ledgerEntries =
      await this.ledgerRepo.getEntriesByDateRange(startDate, endDate);

    const transactions =
      await this.transactionRepo.getByDateRange(startDate, endDate);

    const mismatches: any[] = [];

    const ledgerMap = this.groupByWallet(ledgerEntries);
    const txMap = this.groupByWallet(transactions);

    const wallets = new Set([
      ...Object.keys(ledgerMap),
      ...Object.keys(txMap)
    ]);

    for (const walletId of wallets) {
      const ledgerTotal = this.sum(ledgerMap[walletId]);
      const txTotal = this.sum(txMap[walletId]);

      // ❌ missing transaction
      if (!txMap[walletId]) {
        mismatches.push({
          walletId,
          type: "MISSING_TRANSACTION",
          ledgerTotal
        });
        continue;
      }

      // ❌ missing ledger entry
      if (!ledgerMap[walletId]) {
        mismatches.push({
          walletId,
          type: "MISSING_LEDGER_ENTRY",
          txTotal
        });
        continue;
      }

      // ❌ amount mismatch
      if (ledgerTotal !== txTotal) {
        mismatches.push({
          walletId,
          type: "AMOUNT_MISMATCH",
          ledgerTotal,
          txTotal
        });
      }
    }

    const status = mismatches.length === 0 ? "BALANCED" : "UNBALANCED";

    return {
      status,
      mismatches,
      report: {
        generatedAt: new Date(),
        totalWallets: wallets.size,
        mismatchCount: mismatches.length,
        status
      }
    };
  }

  // 🧠 WALLET BALANCE VALIDATION
  async validateWalletBalances() {
    const wallets = await this.walletRepo.getAllWallets();
    const mismatches: any[] = [];

    for (const wallet of wallets) {
      const ledgerEntries =
        await this.ledgerRepo.getEntriesByDateRange(
          "start",
          "end"
        );

      const walletLedger = ledgerEntries.filter(
        (e: any) => e.walletId === wallet.id
      );

      const ledgerBalance = this.sum(walletLedger);
      const systemBalance = wallet.balance;

      if (ledgerBalance !== systemBalance) {
        mismatches.push({
          walletId: wallet.id,
          type: "BALANCE_DRIFT",
          ledgerBalance,
          systemBalance
        });
      }
    }

    return {
      valid: mismatches.length === 0,
      errors: mismatches
    };
  }

  // 🧠 HELPERS

  private groupByWallet(items: any[]) {
    if(!Array.isArray(items)) return {};
    return items.reduce((acc, item) => {
      if (!acc[item.walletId]) acc[item.walletId] = [];
      acc[item.walletId].push(item);
      return acc;
    }, {});
  }

  private sum(items: any[] = []) {
    return items.reduce((sum, item) => sum + item.amount, 0);
  }
}