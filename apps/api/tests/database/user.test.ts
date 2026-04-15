import { describe, it, expect, beforeEach } from "vitest";
import prisma from "../../src/prisma.js";
import "../../src/config/env.js";
import "../setup/cleanDB.js"

describe("User Model", () => {
//   beforeEach(async () => {
//     await prisma.user.deleteMany();
//   });

  it("should create a user", async () => {
    const user = await prisma.user.create({
      data: {
        email: "test@mail.com",
        password: "hashed",
      },
    });
    //console.log(user)
    expect(user.id).toBeDefined();
    expect(user.email).toBe("test@mail.com");
  });

 it("should enforce unique email", async () => {
  await prisma.user.create({
    data: {
      email: "test@mail.com",
      password: "123",
    },
  });

  await expect(
    prisma.user.create({
      data: {
        email: "test@mail.com",
        password: "123",
      },
    })
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
