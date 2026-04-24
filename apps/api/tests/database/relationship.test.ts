import { describe, it, expect, beforeEach, afterAll } from "vitest";
import prisma from "../../src/prisma.js";


describe("Relations", () => {
beforeEach(async () => {
    await prisma.ledgerEntry.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.wallet.deleteMany();
    await prisma.user.deleteMany();
  },1000000);

  afterAll(async () => {
    await prisma.$disconnect();
  });
  it("user should have wallet", async () => {
    const user = await prisma.user.create({
      data: {
        email: "test@mail.com",
        password: "123",
        wallet: {
          create: { balance: 0 }
        }
      },
      include: { wallet: true }
    });

    expect(user.wallet).toBeDefined();
  });

});