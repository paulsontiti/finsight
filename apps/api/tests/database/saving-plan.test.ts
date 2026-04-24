import { describe, it, expect, beforeEach, afterAll } from "vitest";
import prisma from "../../src/prisma.js";

describe("Savings Plans", () => {

  let userId: string;

  beforeEach(async () => {
    await prisma.savingsPlan.deleteMany();
      await prisma.ledgerEntry.deleteMany();
      await prisma.transaction.deleteMany();
      await prisma.wallet.deleteMany();
      await prisma.user.deleteMany();
    await prisma.user.deleteMany();

    const user = await prisma.user.create({
      data: { email: "user@mail.com", password: "123" }
    });

    userId = user.id;
  },100000);

    afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create a savings plan", async () => {
    const plan = await prisma.savingsPlan.create({
      data: {
        userId,
        targetAmount: 1000
      }
    });

    expect(plan.targetAmount).toBe(1000);
  });

});