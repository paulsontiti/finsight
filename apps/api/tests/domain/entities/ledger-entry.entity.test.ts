import { describe, expect, it } from "vitest";
import { LedgerEntry } from "../../../src/domain/entities/ledger-entry.entity";

describe("Ledger Entry Entity", () => {
  it("should create debit ledger entry", () => {
    const entry = LedgerEntry.create({
      walletId: "wallet_1",
      transactionId: "tx_1",
      type: "DEBIT",
      amount: 100,description:"Description"
    });

    expect(entry.type).toBe("DEBIT");
    expect(entry.amount).toBe(100);
  });

  it("should create credit ledger entry", () => {
    const entry = LedgerEntry.create({
      walletId: "wallet_1",
      transactionId: "tx_1",
      type: "CREDIT",
      amount: 100,description:"Description"
    });

    expect(entry.type).toBe("CREDIT");
  });

  it("should generate ledger entry id", () => {
    const entry = LedgerEntry.create({
      walletId: "wallet_1",
      transactionId: "tx_1",
      type: "DEBIT",
      amount: 50,description:"Description"
    });

    expect(entry.id).toBeDefined();
  });

  it("should reject zero amount", () => {
    expect(() =>
      LedgerEntry.create({
        walletId: "wallet_1",
        transactionId: "tx_1",
        type: "DEBIT",
        amount: 0,description:"Description"
      }),
    ).toThrow();
  });

  it("should reject negative amount", () => {
    expect(() =>
      LedgerEntry.create({
        walletId: "wallet_1",
        transactionId: "tx_1",
        type: "CREDIT",
        amount: -100,description:"Description"
      }),
    ).toThrow();
  });

  it("should require transaction id", () => {
    expect(() =>
      LedgerEntry.create({
        walletId: "wallet_1",
        transactionId: "",
        type: "DEBIT",
        amount: 100,description:"Description"
      }),
    ).toThrow();
  });

  it("should link entry to wallet", () => {
    const entry = LedgerEntry.create({
      walletId: "wallet_123",
      transactionId: "tx_1",
      type: "DEBIT",
      amount: 200,description:"Description"
    });

    expect(entry.walletId).toBe("wallet_123");
  });

  it("should link entry to transaction", () => {
  const entry = LedgerEntry.create({
    walletId: "wallet_1",
    transactionId: "tx_999",
    type: "CREDIT",
    amount: 500,description:"Description"
  });

  expect(entry.transactionId).toBe("tx_999");
});
});
