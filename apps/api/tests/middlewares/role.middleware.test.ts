import { describe, it, expect, vi } from "vitest";
import { roleMiddleware } from "../../src/middlewares/role.middleware";

describe("RoleMiddleware", () => {
  it("should allow access for authorized role", () => {
    const req: any = {
      user: { role: "ADMIN" },
    };

    const res = {};
    const next = vi.fn();

    const middleware = roleMiddleware(["ADMIN"]);

    middleware(req, res as any, next);

    expect(next).toHaveBeenCalled();
  });

  it("should throw if role is not allowed", () => {
    const req: any = {
      user: { role: "USER" },
    };

    const res = {};
    const next = vi.fn();

    const middleware = roleMiddleware(["ADMIN"]);

    expect(() => middleware(req, res as any, next)).toThrow();
  });

  it("should throw if user not attached", () => {
    const req: any = {};

    const res = {};
    const next = vi.fn();

    const middleware = roleMiddleware(["ADMIN"]);

    expect(() => middleware(req, res as any, next)).toThrow();
  });

  it("should allow multiple roles", () => {
    const req: any = {
      user: { role: "USER" },
    };

    const res = {};
    const next = vi.fn();

    const middleware = roleMiddleware(["USER", "ADMIN"]);

    middleware(req, res as any, next);

    expect(next).toHaveBeenCalled();
  });

  it("should check correct role value", () => {
    const req: any = {
      user: { role: "ADMIN" },
    };

    const res = {};
    const next = vi.fn();

    const middleware = roleMiddleware(["ADMIN"]);

    middleware(req, res as any, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it("should not call next if forbidden", () => {
  const req: any = {
    user: { role: "USER" }
  };

  const res = {};
  const next = vi.fn();

  const middleware = roleMiddleware(["ADMIN"]);

  try {
    middleware(req, res as any, next);
  } catch {}

  expect(next).not.toHaveBeenCalled();
});

it("should deny if allowedRoles is empty", () => {
  const req: any = {
    user: { role: "ADMIN" }
  };

  const res = {};
  const next = vi.fn();

  const middleware = roleMiddleware([]);

  expect(() => middleware(req, res as any, next)).toThrow();
});
});
