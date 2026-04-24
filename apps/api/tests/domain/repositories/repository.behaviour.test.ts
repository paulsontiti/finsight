import { describe, it, expect, beforeEach } from "vitest";

interface Entity {
  id: string;
  name: string;
}

class InMemoryRepository implements Repository<Entity> {
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

  it("should create and return entity", async () => {
    const repo = new InMemoryRepository();

    const entity = { id: "2", name: "Jane" };

    const created = await repo.create(entity);

    expect(created).toEqual(entity);
  });
});

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
