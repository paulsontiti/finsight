import { describe, it, expect, vi } from "vitest";
import { apiKeyMiddleware } from "../../src/middlewares/api-key.middleware.js";

describe("ApiKeyMiddleware", () => {

  it("should allow request with valid api key", async () => {
    const req: any = {
      headers: {
        "x-api-key": "valid-key"
      }
    };

    const res = {};
    const next = vi.fn();

    const repo = {
      findByKey: vi.fn().mockResolvedValue({ id: "1" })
    };

    const middleware = apiKeyMiddleware(repo as any);

    await middleware(req, res as any, next);

    expect(next).toHaveBeenCalled();
  });

  it("should throw if api key missing", async () => {
  const req: any = { headers: {} };
  const res = {};
  const next = vi.fn();

  const repo = { findByKey: vi.fn() };

  const middleware = apiKeyMiddleware(repo as any);

  await expect(middleware(req, res as any, next)).rejects.toThrow();
});

it("should throw if api key invalid", async () => {
  const req: any = {
    headers: {
      "x-api-key": "invalid"
    }
  };

  const res = {};
  const next = vi.fn();

  const repo = {
    findByKey: vi.fn().mockResolvedValue(null)
  };

  const middleware = apiKeyMiddleware(repo as any);

  await expect(middleware(req, res as any, next)).rejects.toThrow();
});

it("should call repository with api key", async () => {
  const req: any = {
    headers: {
      "x-api-key": "test-key"
    }
  };

  const res = {};
  const next = vi.fn();

  const repo = {
    findByKey: vi.fn().mockResolvedValue({ id: "1" })
  };

  const middleware = apiKeyMiddleware(repo as any);

  await middleware(req, res as any, next);

  expect(repo.findByKey).toHaveBeenCalledWith("test-key");
});

it("should attach api client to request", async () => {
  const req: any = {
    headers: {
      "x-api-key": "valid"
    }
  };

  const res = {};
  const next = vi.fn();

  const repo = {
    findByKey: vi.fn().mockResolvedValue({ id: "client1" })
  };

  const middleware = apiKeyMiddleware(repo as any);

  await middleware(req, res as any, next);

  expect(req.apiClient.id).toBe("client1");
});

it("should not call next if invalid", async () => {
  const req: any = {
    headers: {
      "x-api-key": "bad"
    }
  };

  const res = {};
  const next = vi.fn();

  const repo = {
    findByKey: vi.fn().mockResolvedValue(null)
  };

  const middleware = apiKeyMiddleware(repo as any);

  try {
    await middleware(req, res as any, next);
  } catch {}

  expect(next).not.toHaveBeenCalled();
});

it("should reject empty api key", async () => {
  const req: any = {
    headers: {
      "x-api-key": ""
    }
  };

  const res = {};
  const next = vi.fn();

  const repo = {
    findByKey: vi.fn()
  };

  const middleware = apiKeyMiddleware(repo as any);

  await expect(middleware(req, res as any, next)).rejects.toThrow();
});

});