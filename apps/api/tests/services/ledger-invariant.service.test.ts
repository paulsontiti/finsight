import { describe, it, expect, beforeEach } from "vitest";
import { LedgerInvariantService } from "../../src/services/ledger-invariant.service";
import { LedgerEntry } from "../../src/domain/entities/ledger-entry.entity";

let service: LedgerInvariantService;

beforeEach(() => {
  service = new LedgerInvariantService();
});

describe("Ledger Invariant Service", () => {
  it("should validate balanced ledger", () => {
    const result = service.validateDebitCreditEquality([
      LedgerEntry.create({
        type: "DEBIT",
        amount: 1000,
        walletId: "123",
        transactionId: "123",
      }),
      LedgerEntry.create({
        type: "CREDIT",
        amount: 1000,
        walletId: "123",
        transactionId: "123",
      }),
    ]);

    expect(result.valid).toBe(true);
  });

  it("should detect imbalance", () => {
  const result = service.validateDebitCreditEquality([
    LedgerEntry.create({
        type: "DEBIT",
        amount: 1000,
        walletId: "123",
        transactionId: "123",
      }),
      LedgerEntry.create({
        type: "CREDIT",
        amount: 500,
        walletId: "123",
        transactionId: "123",
      }),
  ]);

  expect(result.valid).toBe(false);
  expect(result.difference).toBe(500);
});


it("should handle empty ledger", () => {
  const result = service.validateDebitCreditEquality([]);

  expect(result.valid).toBe(true);
});

});
