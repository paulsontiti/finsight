import type { PrismaTransactionRepository } from "../../domain/repositories/prisma-transaction.repository.js";

export class FinancialReportingUseCase {
  constructor(
    private transactionRepo: PrismaTransactionRepository,
    private walletRepo: any,
    private auditRepo: any,
  ) {}

  // 👤 USER SUMMARY
  async getUserFinancialSummary(userId: string) {
    const [transactions, wallet] = await Promise.all([
      this.transactionRepo.findByUser(userId),

      this.walletRepo.findByUserId(userId),
    ]);

    const totalInflow = transactions
      .filter((t: any) => t.type === "CREDIT")
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    const totalOutflow = transactions
      .filter((t: any) => t.type === "DEBIT")
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    return {
      walletBalance: wallet?.balance ?? 0,

      totalTransactions: transactions.length,

      totalInflow,

      totalOutflow,

      netFlow: totalInflow - totalOutflow,
    };
  }

  // 📈 PLATFORM VOLUME
  async getPlatformVolume() {
    const transactions = await this.transactionRepo.findAll();

    return transactions.reduce((sum: number, tx: any) => sum + tx.amount, 0);
  }

  // 🚨 FRAUD REPORT
  async getFraudReport() {
    return this.auditRepo.findByAction("FRAUD_DETECTED");
  }

  // 📅 DAILY TRANSACTION REPORT
  async getDailyTransactionReport(date: Date) {
    return this.transactionRepo.getByDate(date);
  }

  // 📊 MONTHLY REPORT
  async getMonthlyReport(month: number, year: number) {
    return this.transactionRepo.getMonthlyStats(month, year);
  }
}
