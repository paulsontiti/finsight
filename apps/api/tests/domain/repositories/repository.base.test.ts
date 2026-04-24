import { describe, it, expect } from "vitest";
import type { Repository } from "../../../src/shared/types/index.js";



describe("Repository Base Contract", () => {

  it("should define create method", () => {
    const repo: Repository<any> = {
      create: async (data) => data,
      findById: async () => null
    };

    expect(typeof repo.create).toBe("function");
  });

  it("should define findById method", () => {
    const repo: Repository<any> = {
      create: async (data) => data,
      findById: async () => null
    };

    expect(typeof repo.findById).toBe("function");
  });

});