import { describe, it, expect, beforeEach, vi } from "vitest";
import {ReconciliationService} from "../../src/services/reconciliation.service"

let ledgerRepo: any;
let transactionRepo: any;
let walletRepo: any;
let service: ReconciliationService;

beforeEach(() => {
  ledgerRepo = {
    getEntriesByDateRange: vi.fn()
  };

  transactionRepo = {
    getByDateRange: vi.fn()
  };

  walletRepo = {
    getAllWallets: vi.fn()
  };

  service = new ReconciliationService(
    ledgerRepo,
    transactionRepo,
    walletRepo
  );
});

describe("Reconciliation system",()=>{


    it("should return OK when ledger and transactions match", async () => {
  ledgerRepo.getEntriesByDateRange.mockResolvedValue([
    { walletId: "w1", amount: 1000, type: "CREDIT" }
  ]);

  transactionRepo.getByDateRange.mockResolvedValue([
    { walletId: "w1", amount: 1000 }
  ]);

  const result = await service.reconcile("2025-01-01", "2025-01-02");

  expect(result.status).toBe("BALANCED");
  expect(result.mismatches.length).toBe(0);
});

it("should detect missing transaction in ledger", async () => {
  ledgerRepo.getEntriesByDateRange.mockResolvedValue([
    { walletId: "w1", amount: 1000 }
  ]);

  transactionRepo.getByDateRange.mockResolvedValue([]);

  const result = await service.reconcile("start", "end");

  expect(result.status).toBe("UNBALANCED");
  expect(result.mismatches).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        type: "MISSING_TRANSACTION"
      })
    ])
  );
});

it("should detect missing ledger entry", async () => {
  ledgerRepo.getEntriesByDateRange.mockResolvedValue([]);

  transactionRepo.getByDateRange.mockResolvedValue([
    { walletId: "w1", amount: 1000 }
  ]);

  const result = await service.reconcile("start", "end");

  expect(result.status).toBe("UNBALANCED");
  expect(result.mismatches[0].type).toBe("MISSING_LEDGER_ENTRY");
});

it("should detect amount mismatch", async () => {
  ledgerRepo.getEntriesByDateRange.mockResolvedValue([
    { walletId: "w1", amount: 1000 }
  ]);

  transactionRepo.getByDateRange.mockResolvedValue([
    { walletId: "w1", amount: 500 }
  ]);

  const result = await service.reconcile("start", "end");

  expect(result.mismatches[0].type).toBe("AMOUNT_MISMATCH");
});

it("should validate wallet balance consistency", async () => {
  walletRepo.getAllWallets.mockResolvedValue([
    { id: "w1", balance: 1000 }
  ]);

  ledgerRepo.getEntriesByDateRange.mockResolvedValue([
    { walletId: "w1", amount: 1000, type: "CREDIT" }
  ]);

  const result = await service.validateWalletBalances();

  expect(result.valid).toBe(true);
});

it("should detect wallet balance mismatch", async () => {
  walletRepo.getAllWallets.mockResolvedValue([
    { id: "w1", balance: 2000 }
  ]);

  ledgerRepo.getEntriesByDateRange.mockResolvedValue([
    { walletId: "w1", amount: 1000, type: "CREDIT" }
  ]);

  const result = await service.validateWalletBalances();

  expect(result.valid).toBe(false);
  expect(result.errors[0].type).toBe("BALANCE_DRIFT");
});

it("should handle empty ledger and transactions", async () => {
  ledgerRepo.getEntriesByDateRange.mockResolvedValue([]);
  transactionRepo.getByDateRange.mockResolvedValue([]);

  const result = await service.reconcile("start", "end");

  expect(result.status).toBe("BALANCED");
});

it("should handle large reconciliation datasets", async () => {
  ledgerRepo.getEntriesByDateRange.mockResolvedValue(
    Array.from({ length: 1000 }, () => ({
      walletId: "w1",
      amount: 100,
      type: "CREDIT"
    }))
  );

  transactionRepo.getByDateRange.mockResolvedValue(
    Array.from({ length: 1000 }, () => ({
      walletId: "w1",
      amount: 100
    }))
  );

  const result = await service.reconcile("start", "end");

  expect(result.status).toBe("BALANCED");
});

it("should generate audit report", async () => {
  const result = await service.reconcile("start", "end");

  expect(result.report).toBeDefined();
  expect(result.report.generatedAt).toBeDefined();
});

it("should include all mismatches in report", async () => {
  ledgerRepo.getEntriesByDateRange.mockResolvedValue([
    { walletId: "w1", amount: 1000 }
  ]);

  transactionRepo.getByDateRange.mockResolvedValue([]);

  const result = await service.reconcile("start", "end");

  expect(result.report.mismatchCount).toBeGreaterThan(0);
});

})