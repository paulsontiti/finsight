import { describe, it, expect, beforeEach } from "vitest";
import prisma from "../../src/prisma.js";
import "../setup/cleanDB.js"

describe("Ledger Entries", () => {

  beforeEach(async () => {
    // await prisma.ledgerEntry.deleteMany();
  });

  it("should create debit and credit entries", async () => {
    const debit = await prisma.ledgerEntry.create({
      data: {
        amount: 100,
        type: "DEBIT",walletId:"1234",transactionId:"123"
      },
    });

    const credit = await prisma.ledgerEntry.create({
      data: {
        amount: 100,
        type: "CREDIT",walletId:"1234",transactionId:"123"
      }
    });

    expect(debit.amount).toBe(credit.amount);
  });

});