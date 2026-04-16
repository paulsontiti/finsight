import type { TransactionLogger } from "../../shared/logger/transaction.logger.js";
import type { UseCase } from "../interfaces/useCase.js";


export class FundWalletUseCase implements UseCase<any,any>{
  constructor(
    private transactionLogger: TransactionLogger
  ) {}

  async execute(data: any) {
    // ... logic

    this.transactionLogger.logTransaction({
      transactionId: "tx_123",
      walletId: "wallet_1",
      amount: 1000,
      type: "CREDIT",
      status: "SUCCESS"
    });
  }
}