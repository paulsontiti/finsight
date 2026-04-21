import { describe, it, expect } from "vitest";
import prisma from "../../src/prisma.js";
import "../setup/cleanDB.js"
import { log } from "console";

describe("Relations", () => {

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