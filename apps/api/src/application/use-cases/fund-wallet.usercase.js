export class FundWalletUseCase {
    transactionLogger;
    constructor(transactionLogger) {
        this.transactionLogger = transactionLogger;
    }
    async execute(data) {
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
//# sourceMappingURL=fund-wallet.usercase.js.map