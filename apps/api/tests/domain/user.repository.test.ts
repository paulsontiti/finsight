import { describe, it, expect, beforeEach } from "vitest";
import { DBUser, type CreateUserProps } from "../../src/domain/entities/user.entity.js";
import "../setup/cleanDB.js"
import { PrismaUserRepository } from "../../src/domain/repositories/user.repository.js";

const repo = new PrismaUserRepository();
const user:CreateUserProps = {
      email: "test@mail.com",
      password: "Password123!"
    };

describe("UserRepository - Create", () => {


  beforeEach(async () => {
    //await prisma.user.deleteMany();
    
    
  });

  it("should create a user", async () => {
    

    const result = await repo.create(user);
    
    expect(result.id).toBeDefined();
    expect(result.email).toBe("test@mail.com");
  });

});

describe("UserRepository - findById", () => {

  it("should return user if found", async () => {
    
    const created = await repo.create(user);

    const found = await repo.findById(created.id);

    expect(found).not.toBeNull();
    expect(found?.id).toBe(created.id);
  });

  it("should return null if user does not exist", async () => {
   

    const result = await repo.findById("507f1f77bcf86cd799439011");

    expect(result).toBeNull();
  });

});

describe("UserRepository - findByEmail", () => {

  it("should find user by email", async () => {

    await repo.create(user);

    const found = await repo.findByEmail("test@mail.com");

    expect(found).not.toBeNull();
    expect(found?.email).toBe("test@mail.com");
  });

  it("should normalize email before search", async () => {

    await repo.create(user);

    const found = await repo.findByEmail("TEST@MAIL.COM");

    expect(found).not.toBeNull();
  });

  it("should not allow duplicate email", async () => {

  const user2 = {
    email: "test@mail.com",
    password: "Password123!"
  };

  await repo.create(user);

  await expect(repo.create(user2)).rejects.toThrow();
});

it("should persist correct data", async () => {

  const created = await repo.create(user);

  const dbUser = await repo.findById(created.id)

  expect(dbUser?.email).toBe("test@mail.com");
});

// it("should return a User entity", async () => {

//   const result = await repo.create(user);

//   expect(result).toBeInstanceOf(DBUser);
// });

it("should handle long email", async () => {
  const repo = new PrismaUserRepository();

  const email = "a".repeat(50) + "@mail.com";
  user.email = email;

  const result = await repo.create(user);

  expect(result.email).toContain("@mail.com");
});

});