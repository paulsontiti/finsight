import { describe, it, expect, beforeEach } from "vitest";

interface Entity {
  id: string;
  name: string;
}

export class InMemoryRepository implements Repository<Entity> {
  private items: Entity[] = [];

  async create(data: Entity): Promise<Entity> {
    this.items.push(data);
    return data;
  }

  async findById(id: string): Promise<Entity | null> {
    return this.items.find((item) => item.id === id) || null;
  }
}

interface Repository<T> {
  create(data: T): Promise<T>;
  findById(id: string): Promise<T | null>;
}

describe("Repository Behavior", () => {
  let repo: InMemoryRepository;

  beforeEach(() => {
    repo = new InMemoryRepository();
  });

  it("should store and retrieve entity", async () => {
    const entity = { id: "1", name: "Paul" };

    await repo.create(entity);
    const result = await repo.findById("1");

    expect(result).toEqual(entity);
  });

  it("should return null if entity not found", async () => {
    const result = await repo.findById("999");

    expect(result).toBeNull();
  });

 
});
