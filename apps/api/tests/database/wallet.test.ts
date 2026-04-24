import { describe, it, expect, beforeEach, afterAll } from "vitest";
import prisma from "../../src/prisma.js";

describe("Wallet Model", () => {
  let userId: string;

  beforeEach(async () => {
    await prisma.ledgerEntry.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.wallet.deleteMany();
    await prisma.user.deleteMany();

    const user = await prisma.user.create({
      data: { email: "user@mail.com", password: "123" },
    });

    userId = user.id;
  }, 1000000);

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create a wallet for user", async () => {
    const wallet = await prisma.wallet.create({
      data: {
        userId,
        balance: 0,
      },
    });

    expect(wallet.userId).toBe(userId);
  });

  it("should not allow negative balance (business rule later)", async () => {
    const wallet = await prisma.wallet.create({
      data: {
        userId,
        balance: 0,
      },
    });

    expect(wallet.balance).toBeGreaterThanOrEqual(0);
  });
});
