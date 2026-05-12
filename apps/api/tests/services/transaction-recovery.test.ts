import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { TransactionRecoveryService } from "../../src/services/transaction-recovery.service";

describe(
  "TransactionRecoveryService",
  () => {
    let transactionRepo: any;
    let ledgerRepo: any;

    let service: TransactionRecoveryService;

    beforeEach(() => {
      transactionRepo = {
        findPending: vi.fn(),
        updateStatus: vi.fn(),
      };

      ledgerRepo = {
        findByTransaction:
          vi.fn(),
      };

      service =
        new TransactionRecoveryService(
          transactionRepo,
          ledgerRepo,
        );
    });

    // ✅ RECOVER FAILED TX
    it(
      "should mark incomplete transactions as failed",
      async () => {
        transactionRepo.findPending.mockResolvedValue(
          [
            {
              id: "tx_1",
            },
          ],
        );

        ledgerRepo.findByTransaction.mockResolvedValue(
          [],
        );

        await service.recoverIncompleteTransactions();

        expect(
          transactionRepo.updateStatus,
        ).toHaveBeenCalledWith(
          "tx_1",
          "FAILED",
        );
      },
    );

    // ✅ VALID TRANSACTION
    it(
      "should ignore valid transactions",
      async () => {
        transactionRepo.findPending.mockResolvedValue(
          [
            {
              id: "tx_1",
            },
          ],
        );

        ledgerRepo.findByTransaction.mockResolvedValue(
          [
            {
              id: "ledger_1",
            },
          ],
        );

        await service.recoverIncompleteTransactions();

        expect(
          transactionRepo.updateStatus,
        ).not.toHaveBeenCalled();
      },
    );
  },
);