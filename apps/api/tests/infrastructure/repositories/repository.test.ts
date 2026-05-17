import { describe, it, expect } from "vitest";
import type { Repository } from "../../../src/shared/types/index.js";

interface TestEntity {
  id: string;
  name: string;
}

class InMemoryRepo implements Repository<TestEntity> {
  private items: TestEntity[] = [];

  async create(entity: TestEntity): Promise<TestEntity> {
    this.items.push(entity);
    return entity;
  }

  async findById(id: string): Promise<TestEntity | null> {
    return this.items.find(i => i.id === id) || null;
  }
}

describe("Repository Interface", () => {

  it("should save an entity", async () => {
    const repo = new InMemoryRepo();

    const entity = { id: "1", name: "Paul" };

    const result = await repo.create(entity);

    expect(result).toEqual(entity);
  });

  it("should find entity by id", async () => {
    const repo = new InMemoryRepo();

    const entity = { id: "1", name: "Paul" };

    await repo.create(entity);

    const found = await repo.findById("1");

    expect(found).toEqual(entity);
  });

  it("should return null if entity not found", async () => {
    const repo = new InMemoryRepo();

    const result = await repo.findById("999");

    expect(result).toBeNull();
  });

});