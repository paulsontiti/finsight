import { describe, it, expect, beforeEach, afterAll } from "vitest";
import prisma from "../../src/prisma.js";

describe("User Model", () => {
  beforeEach(async () => {
    await prisma.ledgerEntry.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.wallet.deleteMany();
    await prisma.user.deleteMany();
  },100000);

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create a user", async () => {
    const user = await prisma.user.create({
      data: {
        email: "test@mail.com",
        password: "hashed",
      },
    });

    expect(user.id).toBeDefined();
    expect(user.email).toBe("test@mail.com");
  });

  it("should enforce unique email", async () => {
    await prisma.user.create({
      data: { email: "test@mail.com", password: "123" },
    });

    await expect(
      prisma.user.create({
        data: { email: "test@mail.com", password: "123" },
      }),
    ).rejects.toThrow();
  });

  it("should not allow null email", async () => {
    await expect(
      prisma.user.create({
        data: { email: null as any, password: "123" },
      }),
    ).rejects.toThrow();
  });
});
