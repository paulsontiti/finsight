import { Logger } from "./logger.js";

export class TransactionLogger extends Logger {
  logTransaction(data: {
    transactionId: string;
    walletId: string;
    amount: number;
    type: "CREDIT" | "DEBIT";
    status: string;
  }) {
    this.info("Transaction Log", data);
  }
}
