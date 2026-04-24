import type { TransactionLogger } from "../../shared/logger/transaction.logger.js";
import type { UseCase } from "../interfaces/useCase.js";
export declare class FundWalletUseCase implements UseCase<any, any> {
    private transactionLogger;
    constructor(transactionLogger: TransactionLogger);
    execute(data: any): Promise<void>;
}
//# sourceMappingURL=fund-wallet.usercase.d.ts.map