import { describe, it, expect } from "vitest";
import prisma from "../../src/prisma.js";
import "../setup/cleanDB.js"

describe("Constraints", () => {

  it("should not create wallet without user", async () => {
//     await expect(
//       prisma.wallet.create({
//         data: {
//           userId: "fake-id",
//           balance: 0
//         }
//       })
//     ).rejects.toThrow();
  });

});