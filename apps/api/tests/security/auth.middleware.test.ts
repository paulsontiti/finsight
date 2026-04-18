import { describe, it, expect, vi } from "vitest";
import { authMiddleware } from "../../src/middlewares/auth.middleware.js";

describe("AuthMiddleware", () => {

  it("should allow request with valid token", () => {
    const req:any = {
      headers: {
        authorization: "Bearer valid-token"
      }
    };

    const res = {};
    const next = vi.fn();

    const tokenService = {
      verify: vi.fn().mockReturnValue({user:{userId: "1"} })
    };

    const middleware = authMiddleware(tokenService as any);

    middleware(req, res as any, next);

    expect(next).toHaveBeenCalled();
    expect(req.user.userId).toBe("1");
  });

  it("should throw if no authorization header", () => {
  const req: any = { headers: {} };
  const res = {};
  const next = vi.fn();

  const tokenService = { verify: vi.fn() };

  const middleware = authMiddleware(tokenService as any);

  expect(() => middleware(req, res as any, next)).toThrow();
});

it("should throw if token is missing", () => {
  const req: any = {
    headers: {
      authorization: "Bearer"
    }
  };

  const res = {};
  const next = vi.fn();

  const tokenService = { verify: vi.fn() };

  const middleware = authMiddleware(tokenService as any);

  expect(() => middleware(req, res as any, next)).toThrow();
});

it("should throw if token is invalid", () => {
  const req: any = {
    headers: {
      authorization: "Bearer invalid-token"
    }
  };

  const res = {};
  const next = vi.fn();

  const tokenService = {
    verify: vi.fn().mockImplementation(() => {
      throw new Error();
    })
  };

  const middleware = authMiddleware(tokenService as any);

  expect(() => middleware(req, res as any, next)).toThrow();
});

it("should attach user payload to request", () => {
  const req: any = {
    headers: {
      authorization: "Bearer valid-token"
    }
  };

  const res = {};
  const next = vi.fn();

  const tokenService = {
    verify: vi.fn().mockReturnValue({user:{userId: "123"} })
  };

  const middleware = authMiddleware(tokenService as any);

  middleware(req, res as any, next);

  expect(req.user).toEqual({ userId: "123" });
});

it("should call verify with extracted token", () => {
  const req: any = {
    headers: {
      authorization: "Bearer token123"
    }
  };

  const res = {};
  const next = vi.fn();

  const tokenService = {
    verify: vi.fn().mockReturnValue({ userId: "1" })
  };

  const middleware = authMiddleware(tokenService as any);

  middleware(req, res as any, next);

  expect(tokenService.verify).toHaveBeenCalledWith("token123");
});

});