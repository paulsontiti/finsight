import { Logger } from "./logger.js";
export declare class TransactionLogger extends Logger {
    logTransaction(data: {
        transactionId: string;
        walletId: string;
        amount: number;
        type: "CREDIT" | "DEBIT";
        status: string;
    }): void;
}
//# sourceMappingURL=transaction.logger.d.ts.map