import { afterAll, beforeEach, describe, expect, it } from "vitest";
import prisma from "../../../src/prisma";
import request from "supertest";
import app from "../../../src/app";

describe("Email Verification endpoint", () => {
  beforeEach(async () => {
    await prisma.verificationToken.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.ledgerEntry.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.wallet.deleteMany();
    await prisma.user.deleteMany();
  }, 1000000000);

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should verify user successfully", async () => {
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

    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    expect(updatedUser?.isVerified).toBe(true);
  });

  it("should delete token after verification", async () => {
    const user = await prisma.user.create({
      data: {
        email: "delete@mail.com",
        password: "hashed",
      },
    });

    const token = "delete-token";

    await prisma.verificationToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 10000),
      },
    });

    await request(app).get(`/api/auth/verify?token=${token}`);

    const record = await prisma.verificationToken.findFirst({
      where: { token },
    });

    expect(record).toBeNull();
  });

  it("should return success response", async () => {
    const user = await prisma.user.create({
      data: {
        email: "msg@mail.com",
        password: "hashed",
      },
    });

    const token = "msg-token";

    await prisma.verificationToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 10000),
      },
    });

    const res = await request(app).get(`/api/auth/verify?token=${token}`);

    expect(res.body.message).toBeDefined();
  });

  it("should fail if token is missing", async () => {
    const res = await request(app).get("/api/auth/verify");

    expect(res.status).toBe(401);
  });
  it("should fail if token is empty", async () => {
    const res = await request(app).get("/api/auth/verify?token=");

    expect(res.status).toBe(401);
  });

  it("should fail for invalid token", async () => {
    const res = await request(app).get("/api/auth/verify?token=invalid");

    expect(res.status).toBe(401);
  });

  it("should fail expired token", async () => {
    const user = await prisma.user.create({
      data: {
        email: "expired@mail.com",
        password: "hashed",
      },
    });

    const token = "expired-token";

    await prisma.verificationToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() - 1000),
      },
    });

    const res = await request(app).get(`/api/auth/verify?token=${token}`);

    expect(res.status).toBe(401);
  });

  it("should fail if user does not exist", async () => {
    const token = "orphan-token";

    await prisma.verificationToken.create({
      data: {
        userId: "non-existent-id",
        token,
        expiresAt: new Date(Date.now() + 10000),
      },
    });

    const res = await request(app).get(`/api/auth/verify?token=${token}`);

    expect(res.status).toBe(409);
  });

  it("should not allow reuse of token", async () => {
    const user = await prisma.user.create({
      data: {
        email: "reuse@mail.com",
        password: "hashed",
      },
    });

    const token = "reuse-token";

    await prisma.verificationToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 10000),
      },
    });

    await request(app).get(`/api/auth/verify?token=${token}`);

    const res = await request(app).get(`/api/auth/verify?token=${token}`);

    expect(res.status).toBe(401);
  });

  it("should not expose token details in response", async () => {
    const res = await request(app).get("/api/auth/verify?token=fake");

    expect(res.body.token).toBeUndefined();
  });

  it("should reject sql injection attempts", async () => {
    const res = await request(app).get("/api/auth/verify?token=' OR 1=1 --");

    expect(res.status).toBe(401);
  });

  it("should reject extremely long token", async () => {
    const longToken = "a".repeat(5000);

    const res = await request(app).get(`/api/auth/verify?token=${longToken}`);

    expect(res.status).toBe(401);
  });

  it("should persist verification token", async () => {
    const user = await prisma.user.create({
      data: {
        email: "store@mail.com",
        password: "hashed",
      },
    });

    const token = "store-token";

    await prisma.verificationToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 10000),
      },
    });

    const record = await prisma.verificationToken.findFirst({
      where: { token },
    });

    expect(record).not.toBeNull();
  });

  it("should not verify user on invalid token", async () => {
    const user = await prisma.user.create({
      data: {
        email: "safe@mail.com",
        password: "hashed",
        isVerified: false,
      },
    });

    await request(app).get("/api/auth/verify?token=invalid");

    const updated = await prisma.user.findUnique({
      where: { id: user.id },
    });

    expect(updated?.isVerified).toBe(false);
  });

  it("should verify correct user only", async () => {
    const user1 = await prisma.user.create({
      data: { email: "u1@mail.com", password: "hashed" },
    });

    const user2 = await prisma.user.create({
      data: { email: "u2@mail.com", password: "hashed" },
    });

    const token = "multi-token";

    await prisma.verificationToken.create({
      data: {
        userId: user1.id,
        token,
        expiresAt: new Date(Date.now() + 10000),
      },
    });

    await request(app).get(`/api/auth/verify?token=${token}`);

    const u1 = await prisma.user.findUnique({ where: { id: user1.id } });
    const u2 = await prisma.user.findUnique({ where: { id: user2.id } });

    expect(u1?.isVerified).toBe(true);
    expect(u2?.isVerified).toBe(false);
  });

  it("should return consistent response structure", async () => {
    const res = await request(app).get("/api/auth/verify?token=invalid");

    expect(res.body).toHaveProperty("message");
  });
});
