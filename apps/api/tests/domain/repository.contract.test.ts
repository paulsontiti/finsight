import { describe, expect, it } from "vitest";
import { InMemoryRepository } from "./repository.behaviour.test.js";

describe("repository contract", () => {
  it("should not mutate stored entity externally", async () => {
    const repo = new InMemoryRepository();

    const entity = { id: "3", name: "John" };

    await repo.create(entity);

    const result = await repo.findById("3");

    if (result) {
      result.name = "HACKED";
    }

    const fresh = await repo.findById("3");

    expect(fresh?.name).toBe("HACKED"); // shows mutation risk
  });
});
