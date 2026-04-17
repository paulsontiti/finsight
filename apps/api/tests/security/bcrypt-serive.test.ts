import { describe, it, expect } from "vitest";
import { container } from "../../src/shared/container/index.js";
import type { BcryptService } from "../../src/shared/security/bcrypt.service.js";

const hashServiceRepository = container.resolve<BcryptService>("hashServiceRepository");

describe("bcrypt", () => {
  it("should throw error on invalid input", async () => {
    await expect(
      hashServiceRepository.hash(undefined as any)
    ).rejects.toThrow();
  });
});