import { describe, it, expect, vi } from "vitest";
import { ApiKeyUseCase } from "../../src/application/use-cases/api-key.usecase.js";

describe("ApiKeyService", () => {

  it("should generate api key", async () => {
    const repo = {
      create: vi.fn()
    };

    const hashService = {
      hash: vi.fn().mockResolvedValue("hashed-key")
    };

    const service = new ApiKeyUseCase(repo as any, hashService as any);

    const result = await service.execute("user-1");

    expect(result.apiKey).toBeDefined();
  });
  it("should hash generated api key", async () => {
  const repo = {
    create: vi.fn()
  };

  const hashService = {
    hash: vi.fn().mockResolvedValue("hashed-key")
  };

  const service = new ApiKeyUseCase(repo as any, hashService as any);

  const result = await service.execute("user-1");

  expect(hashService.hash).toHaveBeenCalledWith(result.apiKey);
});

it("should store hashed key in repository", async () => {
  const repo = {
    create: vi.fn()
  };

  const hashService = {
    hash: vi.fn().mockResolvedValue("hashed-key")
  };

  const service = new ApiKeyUseCase(repo as any, hashService as any);

  const result = await service.execute("user-1");

  expect(repo.create).toHaveBeenCalledWith({
    hashedKey: "hashed-key",
    ownerId: "user-1"
  });
});

it("should return only raw api key", async () => {
  const repo = {
    create: vi.fn()
  };

  const hashService = {
    hash: vi.fn().mockResolvedValue("hashed-key")
  };

  const service = new ApiKeyUseCase(repo as any, hashService as any);

  const result = await service.execute("user-1");

  expect(result).toHaveProperty("apiKey");
  expect(result).not.toHaveProperty("hashedKey");
});

it("should call repository create once", async () => {
  const repo = {
    create: vi.fn()
  };

  const hashService = {
    hash: vi.fn().mockResolvedValue("hashed-key")
  };

  const service = new ApiKeyUseCase(repo as any, hashService as any);

  await service.execute("user-1");

  expect(repo.create).toHaveBeenCalledTimes(1);
});

it("should throw if hash fails", async () => {
  const repo = {
    create: vi.fn()
  };

  const hashService = {
    hash: vi.fn().mockRejectedValue(new Error("hash error"))
  };

  const service = new ApiKeyUseCase(repo as any, hashService as any);

  await expect(service.execute("user-1"))
    .rejects.toThrow("hash error");
});

it("should never store raw api key", async () => {
  const repo = {
    create: vi.fn()
  };

  const hashService = {
    hash: vi.fn().mockResolvedValue("hashed-key")
  };

  const service = new ApiKeyUseCase(repo as any, hashService as any);

  const result = await service.execute("user-1");

  const stored = repo.create.mock.calls[0]?.[0];

  expect(stored.hashedKey).not.toBe(result.apiKey);
});

});