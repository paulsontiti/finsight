import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { PrismaUserRepository } from "../../src/domain/repositories/user.repository.js";
import prisma from "../../src/prisma.js";

const repo = new PrismaUserRepository();
beforeEach(async () => {
  await prisma.ledgerEntry.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.user.deleteMany();
}, 1000000);

afterAll(async () => {
  await prisma.$disconnect();
});
describe("UserRepository - Create", () => {
  it("should create a user", async () => {
    const user = {
      email: "test@mail.com",
      password: "Password123!",
    };

    const result = await repo.create(user);

    expect(result.id).toBeDefined();
    expect(result.email).toBe("test@mail.com");
  });
});

describe("UserRepository - findById", () => {
  it("should return user if found", async () => {
    const repo = new PrismaUserRepository();

    const user = {
      email: "test@mail.com",
      password: "Password123!",
    };

    const created = await repo.create(user);

    const found = await repo.findById(created.id);

    //console.log(found)

    expect(found).not.toBeNull();
    expect(found?.id).toBe(created.id);
  });

  it("should return null if user does not exist", async () => {
    const repo = new PrismaUserRepository();

    const result = await repo.findById("6627f4c9a8b3e1d2f0c9ab47");

    expect(result).toBeNull();
  });
});
describe("UserRepository - findByEmail", () => {
  it("should find user by email", async () => {
    const repo = new PrismaUserRepository();

    const user = {
      email: "test@mail.com",
      password: "Password123!",
    };

    await repo.create(user);

    const found = await repo.findByEmail("test@mail.com");

    expect(found).not.toBeNull();
    expect(found?.email).toBe("test@mail.com");
  });

  it("should normalize email before search", async () => {
    const repo = new PrismaUserRepository();

    const user = {
      email: "test@mail.com",
      password: "Password123!",
    };

    await repo.create(user);

    const found = await repo.findByEmail("TEST@MAIL.COM");

    expect(found).not.toBeNull();
  });
});

it("should not allow duplicate email", async () => {
  const repo = new PrismaUserRepository();

  const user1 = {
    email: "test@mail.com",
    password: "Password123!",
  };

  const user2 = {
    email: "test@mail.com",
    password: "Password123!",
  };

  await repo.create(user1);

  await expect(repo.create(user2)).rejects.toThrow();
});

it("should persist correct data", async () => {
  const repo = new PrismaUserRepository();

  const user = {
    email: "test@mail.com",
    password: "Password123!",
  };

  const created = await repo.create(user);

  const dbUser = await prisma.user.findUnique({
    where: { id: created.id },
  });

  expect(dbUser?.email).toBe("test@mail.com");
});

// it("should return a User entity", async () => {
//   const repo = new PrismaUserRepository();

//   const user = {
//     email: "test@mail.com",
//     password: "Password123!"
//   };

//   const result = await repo.create(user);
//   console.log(result)
//   expect(result).toBeInstanceOf(DBUserEntity);
// });
it("should handle long email", async () => {
  const repo = new PrismaUserRepository();

  const email = "a".repeat(50) + "@mail.com";

  const user = {
    email,
    password: "Password123!"
  };

  const result = await repo.create(user);

  expect(result.email).toContain("@mail.com");
});