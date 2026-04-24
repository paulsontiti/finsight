import { Logger } from "./logger.js";
export class TransactionLogger extends Logger {
    logTransaction(data) {
        this.info("Transaction Log", data);
    }
}
//# sourceMappingURL=transaction.logger.js.map