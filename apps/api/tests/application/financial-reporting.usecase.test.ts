import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { FinancialReportingUseCase } from "../../src/application/use-cases/financial-reporting.usecase";

let transactionRepo: any;
let walletRepo: any;
let auditRepo: any;

let useCase: FinancialReportingUseCase;

beforeEach(() => {
  transactionRepo = {
    findByUser: vi.fn(),
    findAll: vi.fn(),
    getByDate: vi.fn(),
    getMonthlyStats: vi.fn(),
  };

  walletRepo = {
    findByUserId: vi.fn(),
  };

  auditRepo = {
    findByAction: vi.fn(),
  };

  useCase =
    new FinancialReportingUseCase(
      transactionRepo,
      walletRepo,
      auditRepo,
    );
});

describe(
  "FinancialReportingUseCase",
  () => {
    // 👤 USER SUMMARY
    it(
      "should generate user financial summary",
      async () => {
        transactionRepo.findByUser.mockResolvedValue(
          [
            {
              type: "CREDIT",
              amount: 5000,
            },

            {
              type: "DEBIT",
              amount: 2000,
            },
          ],
        );

        walletRepo.findByUserId.mockResolvedValue(
          {
            balance: 3000,
          },
        );

        const result =
          await useCase.getUserFinancialSummary(
            "user_1",
          );

        expect(
          result.totalInflow,
        ).toBe(5000);

        expect(
          result.totalOutflow,
        ).toBe(2000);

        expect(
          result.netFlow,
        ).toBe(3000);
      },
    );

    // 📈 PLATFORM VOLUME
    it(
      "should calculate total platform volume",
      async () => {
        transactionRepo.findAll.mockResolvedValue(
          [
            { amount: 1000 },
            { amount: 5000 },
            { amount: 2000 },
          ],
        );

        const result =
          await useCase.getPlatformVolume();

        expect(result).toBe(8000);
      },
    );

    // 🚨 FRAUD REPORT
    it(
      "should return fraud reports",
      async () => {
        auditRepo.findByAction.mockResolvedValue(
          [
            {
              action:
                "FRAUD_DETECTED",
            },
          ],
        );

        const result =
          await useCase.getFraudReport();

        expect(
          auditRepo.findByAction,
        ).toHaveBeenCalledWith(
          "FRAUD_DETECTED",
        );

        expect(
          result.length,
        ).toBe(1);
      },
    );

    // 📅 DAILY REPORT
    it(
      "should generate daily transaction report",
      async () => {
        const date = new Date();

        transactionRepo.getByDate.mockResolvedValue(
          [],
        );

        await useCase.getDailyTransactionReport(
          date,
        );

        expect(
          transactionRepo.getByDate,
        ).toHaveBeenCalledWith(
          date,
        );
      },
    );

    // 📊 MONTHLY REPORT
    it(
      "should generate monthly report",
      async () => {
        transactionRepo.getMonthlyStats.mockResolvedValue(
          {
            _sum: {
              amount: 50000,
            },

            _count: 20,
          },
        );

        const result =
          await useCase.getMonthlyReport(
            7,
            2026,
          );

        expect(
          result._sum.amount,
        ).toBe(50000);
      },
    );

    // 🚨 EMPTY TRANSACTIONS
    it(
      "should handle empty transaction history",
      async () => {
        transactionRepo.findByUser.mockResolvedValue(
          [],
        );

        walletRepo.findByUserId.mockResolvedValue(
          {
            balance: 0,
          },
        );

        const result =
          await useCase.getUserFinancialSummary(
            "user_1",
          );

        expect(
          result.totalInflow,
        ).toBe(0);

        expect(
          result.totalOutflow,
        ).toBe(0);
      },
    );

    // 🚨 DB FAILURE
    it(
      "should throw on database failure",
      async () => {
        transactionRepo.findAll.mockRejectedValue(
          new Error("DB failure"),
        );

        await expect(
          useCase.getPlatformVolume(),
        ).rejects.toThrow(
          "DB failure",
        );
      },
    );

    // 🚀 HIGH VOLUME REPORTING
    it(
      "should process large reports efficiently",
      async () => {
        const largeTransactions =
          Array.from(
            { length: 1000 },
            () => ({
              amount: 1000,
            }),
          );

        transactionRepo.findAll.mockResolvedValue(
          largeTransactions,
        );

        const result =
          await useCase.getPlatformVolume();

        expect(result).toBe(
          1000000,
        );
      },
    );
  },
);