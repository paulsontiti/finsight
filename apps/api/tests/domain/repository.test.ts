import { describe, it, expect } from "vitest";
import type { Repository } from "../../src/domain/repositories/repository.js";

interface TestEntity {
  id: string;
  name: string;
}

class InMemoryRepo implements Repository<TestEntity> {
  private items: TestEntity[] = [];

  async save(entity: TestEntity): Promise<TestEntity> {
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

    const result = await repo.save(entity);

    expect(result).toEqual(entity);
  });

  it("should find entity by id", async () => {
    const repo = new InMemoryRepo();

    const entity = { id: "1", name: "Paul" };

    await repo.save(entity);

    const found = await repo.findById("1");

    expect(found).toEqual(entity);
  });

  it("should return null if entity not found", async () => {
    const repo = new InMemoryRepo();

    const result = await repo.findById("999");

    expect(result).toBeNull();
  });

});