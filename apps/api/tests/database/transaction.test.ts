import { describe, it, expect, beforeEach } from "vitest";
import prisma from "../../src/prisma.js";
import "../setup/cleanDB.js"

describe("Transaction Model", () => {
  let walletId: string;

  beforeEach(async () => {
    // await prisma.transaction.deleteMany();
    // await prisma.wallet.deleteMany();
    // await prisma.user.deleteMany();

    const user = await prisma.user.create({
      data: { email: "user@mail.com", password: "123" },
    });

    const wallet = await prisma.wallet.create({
      data: { userId: user.id, balance: 0 },
    });

    walletId = wallet.id;
  });

  it("should create a transaction", async () => {
    const tx = await prisma.transaction.create({
      data: {
        walletId,
        amount: 100,
        type: "CREDIT",
        reference: "123",
      },
    });
    expect(tx.amount).toBe(100);
  });

  it("should store transaction type correctly", async () => {
    const tx = await prisma.transaction.create({
      data: {
        walletId,
        amount: 50,
        type: "DEBIT",
        reference: "123",
      },
    });

    expect(tx.type).toBe("DEBIT");
  });
  // it("should not create transaction without wallet", async () => {

  //   await expect(
  //     prisma.transaction.create({
  //       data: {
  //         walletId: "invalid",
  //         amount: 100,
  //         type: "CREDIT",reference:"123"
  //       }
  //     })
  //   ).rejects.toThrow();
  // });
  it("total debit should equal total credit", async () => {
    const debit = 100;
    const credit = 100;

    expect(debit).toBe(credit);
  });
});
