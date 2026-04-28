import { describe, expect, it } from "vitest";
import { Transaction } from "../../../src/domain/entities/transaction.entity";

describe("Transaction Entity", () => {
  it("should create transaction successfully", () => {
    const tx = Transaction.create({
      userId: "user_1",
      type: "WALLET_FUNDING",
      amount: 1000,
      reference: "ref_123",
    });

    expect(tx).toBeDefined();
    expect(tx.amount).toBe(1000);
  });

  it("should default transaction status to PENDING", () => {
    const tx = Transaction.create({
      userId: "user_1",
      type: "TRANSFER",
      amount: 500,
      reference: "ref_456",
    });

    expect(tx.status).toBe("PENDING");
  });

  it("should generate transaction id", () => {
    const tx = Transaction.create({
      userId: "user_1",
      type: "PAYMENT",
      amount: 300,
      reference: "ref_789",
    });

    expect(tx.id).toBeDefined();
  });

  it("should reject zero amount", () => {
    expect(() =>
      Transaction.create({
        userId: "user_1",
        type: "TRANSFER",
        amount: 0,
        reference: "ref_1",
      }),
    ).toThrow();
  });

  it("should reject negative amount", () => {
    expect(() =>
      Transaction.create({
        userId: "user_1",
        type: "TRANSFER",
        amount: -100,
        reference: "ref_2",
      }),
    ).toThrow();
  });

  it("should require transaction reference", () => {
    expect(() =>
      Transaction.create({
        userId: "user_1",
        type: "TRANSFER",
        amount: 100,
        reference: "",
      }),
    ).toThrow();
  });

  it("should mark transaction as SUCCESS", () => {
    const tx = Transaction.create({
      userId: "user_1",
      type: "WALLET_FUNDING",
      amount: 1000,
      reference: "ref_1",
    });

    tx.markSuccess();

    expect(tx.status).toBe("SUCCESS");
  });

  it("should mark transaction as FAILED", () => {
    const tx = Transaction.create({
      userId: "user_1",
      type: "PAYMENT",
      amount: 100,
      reference: "ref_2",
    });

    tx.markFailed();

    expect(tx.status).toBe("FAILED");
  });

  it("should detect pending transaction", () => {
    const tx = Transaction.create({
      userId: "user_1",
      type: "TRANSFER",
      amount: 200,
      reference: "ref_3",
    });

    expect(tx.isPending()).toBe(true);
  });
});
