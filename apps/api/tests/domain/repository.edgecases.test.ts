import { describe, it, expect } from "vitest";
import { InMemoryRepository } from "./repository.behaviour.test.js";

describe("Repository Edge Cases", () => {

  it("should return null for empty repository", async () => {
    const repo = new InMemoryRepository();

    const result = await repo.findById("1");

    expect(result).toBeNull();
  });

  it("should not crash on invalid id types", async () => {
    const repo = new InMemoryRepository();

    const result = await repo.findById("" as any);

    expect(result).toBeNull();
  });

});