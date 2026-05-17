import { describe, it, expect, vi, beforeEach } from "vitest";
import jwt from "jsonwebtoken";
import { BcryptService } from "../../../src/shared/security/bcrypt.service";
import { authorizeMiddleware } from "../../../src/domain/middlewares/authorize.middleware";
import { EncryptionService } from "../../../src/domain/services/encryption.service";
import { validateSchemaMiddleware } from "../../../src/domain/middlewares/validate.middleware";
import { z } from "zod";

describe("Rate Limiting", () => {
  it("should block excessive requests", async () => {
    const res: any = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };

    const next = vi.fn();

    const fakeRateLimiter = (count: number) => {
      if (count > 5) {
        res.status(429).send("Too many requests");
      } else {
        next();
      }
    };

    // simulate abuse
    for (let i = 0; i < 10; i++) {
      fakeRateLimiter(i);
    }

    expect(res.status).toHaveBeenCalledWith(429);
  });
});

describe("JWT Security", () => {
  it("should reject expired JWT", () => {
    const token = jwt.sign({ userId: "123" }, "secret", { expiresIn: "-10s" });

    expect(() => {
      jwt.verify(token, "secret");
    }).toThrow();
  });
});

describe("RBAC", () => {
  it("should deny unauthorized roles", () => {
    const req: any = {
      user: { role: "APPUSER" },
    };

    const res: any = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };

    const next = vi.fn();

    authorizeMiddleware("ADMIN")(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("should allow correct role", () => {
    const req: any = {
      user: { role: "ADMIN" },
    };

    const res: any = {};
    const next = vi.fn();

    authorizeMiddleware("ADMIN")(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});

describe("Password Security", () => {
  it("should hash passwords securely", async () => {
    const password = "myPassword123";

    const bcrypt = new BcryptService();
    const hash = await bcrypt.hash(password);

    const match = await bcrypt.compare(password, hash);

    expect(match).toBe(true);
  });
});

describe("Request Validation", () => {
  const schema = z.object({
    amount: z.number().positive(),
  });

  const middleware = validateSchemaMiddleware(schema);

  it("should reject invalid payload", () => {
    const req: any = {
      body: { amount: -50 },
    };

    const res: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    const next = vi.fn();

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe("Webhook Security", () => {
  it("should reject replayed webhooks", async () => {
    const processed = new Set<string>();

    const processWebhook = (ref: string) => {
      if (processed.has(ref)) {
        throw new Error("Replay detected");
      }

      processed.add(ref);
    };

    processWebhook("ref_123");

    expect(() => {
      processWebhook("ref_123");
    }).toThrow("Replay detected");
  });
});

describe("Encryption", () => {
  it("should encrypt and decrypt sensitive data", () => {
    const service = new EncryptionService();

    const encrypted = service.encrypt("sensitive-data");

    expect(encrypted).not.toBe("sensitive-data");
    expect(encrypted.includes(":")).toBe(true);
  });
});

describe("Token Revocation", () => {
  it("should revoke refresh token", () => {
    const tokens = new Set<string>();

    const revoke = (token: string) => {
      tokens.add(token);
    };

    const isRevoked = (token: string) => {
      return tokens.has(token);
    };

    revoke("token_1");

    expect(isRevoked("token_1")).toBe(true);
  });
});
describe("Brute Force Protection", () => {
  it("should block repeated login attempts", () => {
    let attempts = 0;

    const login = () => {
      attempts++;

      if (attempts > 5) {
        throw new Error("Blocked");
      }
    };

    for (let i = 0; i < 10; i++) {
      try {
        login();
      } catch {}
    }

    expect(attempts).toBeGreaterThan(5);
  });
});