import { describe, it, expect, beforeEach, afterAll } from "vitest";
import prisma from "../../src/prisma.js";

describe("Ledger Entries", () => {

  beforeEach(async () => {
    await prisma.ledgerEntry.deleteMany();
  },100000);

    afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create debit and credit entries", async () => {
    const debit = await prisma.ledgerEntry.create({
      data: {
        amount: 100,
        type: "DEBIT",
        transactionId:"123",
        walletId:"123"
      }
    });

    const credit = await prisma.ledgerEntry.create({
      data: {
        amount: 100,
        type: "CREDIT", transactionId:"123",
        walletId:"123"
      }
    });

    expect(debit.amount).toBe(credit.amount);
  });

});