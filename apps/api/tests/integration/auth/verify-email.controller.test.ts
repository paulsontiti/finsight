import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import prisma from "../../../src/prisma";
import { VerifyEmailController } from "../../../src/controllers/verify-email.controller";
import app from "../../../src/app";

describe("Verify Email Controller", () => {
  beforeEach(async () => {
    await prisma.verificationToken.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.ledgerEntry.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.wallet.deleteMany();
    await prisma.user.deleteMany();
  }, 100000000);

  afterAll(async () => {
    await prisma.$disconnect();
  });
  it("should return 201 for valid token", async () => {
    const user = await prisma.user.create({
      data: {
        email: "verify@mail.com",
        password: "hashed",
        isVerified: false,
      },
    });

    const token = "verify-token";

    await prisma.verificationToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 10000),
      },
    });

    const res = await request(app).get(`/api/auth/verify?token=${token}`);

    expect(res.status).toBe(201);
  });

  it("should return 401 if token missing", async () => {
    const res = await request(app).get("/api/auth/verify");

    expect(res.status).toBe(401);
  });

  it("should return 401 if token empty", async () => {
    const res = await request(app).get("/api/auth/verify?token=");

    expect(res.status).toBe(401);
  });

  it("should call use case with token", async () => {
    const execute = vi.fn().mockResolvedValue({});
    const controller = new VerifyEmailController({ execute });

    await controller.handle(
      { query: { token: "abc" } } as any,
      { status: vi.fn().mockReturnThis(), json: vi.fn() } as any,
      vi.fn(),
    );

    expect(execute).toHaveBeenCalledWith("abc");
  });
  it("should call next on error", async () => {
    const controller = new VerifyEmailController({
      execute: vi.fn().mockRejectedValue(new Error()),
    });

    const next = vi.fn();

    await controller.handle(
      { query: { token: "abc" } } as any,
      {} as any,
      next,
    );

    expect(next).toHaveBeenCalled();
  });
});
