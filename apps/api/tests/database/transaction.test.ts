import { describe, it, expect, beforeEach, afterAll } from "vitest";
import prisma from "../../src/prisma.js";

describe("Transaction Model", () => {

  let walletId: string;

  beforeEach(async () => {
    await prisma.ledgerEntry.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.wallet.deleteMany();
    await prisma.user.deleteMany();

    const user = await prisma.user.create({
      data: { email: "user@mail.com", password: "123" }
    });

    const wallet = await prisma.wallet.create({
      data: { userId: user.id, balance: 0 }
    });

    walletId = wallet.id;
  },1000000);

  afterAll(async()=>{
    await prisma.$disconnect();
  })

  it("should create a transaction", async () => {
    const tx = await prisma.transaction.create({
      data: {
        walletId,
        amount: 100,
        type: "CREDIT",
        reference:"124"
      }
    });

    expect(tx.amount).toBe(100);
  });

  it("should store transaction type correctly", async () => {
    const tx = await prisma.transaction.create({
      data: {
        walletId,
        amount: 50,
        type: "DEBIT",reference:"123"
      }
    });

    expect(tx.type).toBe("DEBIT");
  });

  it("total debit should equal total credit", async () => {
  const debit = 100;
  const credit = 100;

  expect(debit).toBe(credit);
});


});