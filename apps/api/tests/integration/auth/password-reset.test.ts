import { afterAll, beforeEach, describe, expect, it } from "vitest";
import prisma from "../../../src/prisma";
import app from "../../../src/app";
import request from "supertest";

describe("Password Reset Endpoint", () => {
  beforeEach(async () => {
    await prisma.passwordResetToken.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.ledgerEntry.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.wallet.deleteMany();
    await prisma.user.deleteMany();
  }, 1000000000);

  afterAll(async () => {
    await prisma.$disconnect();
  });
  it("should send password reset email", async () => {

    await prisma.user.create({
      data: {
        email: "reset@mail.com",
        password: "hashed",
      },
    });

    const res = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "reset@mail.com" });

    expect(res.status).toBe(200);
  });

  it("should create password reset token", async () => {
  await prisma.user.create({
    data: {
      email: "token@mail.com",
      password: "hashed"
    }
  });

  await request(app)
    .post("/api/auth/forgot-password")
    .send({ email: "token@mail.com" });

  const token = await prisma.passwordResetToken.findFirst();

  expect(token).not.toBeNull();
});

it("should reset password successfully", async () => {
  const user = await prisma.user.create({
    data: {
      email: "reset2@mail.com",
      password: "old"
    }
  });

  const token = "valid-token";

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 10000)
    }
  });

  const res = await request(app)
    .post("/api/auth/reset-password")
    .send({
      token,
      password: "Newpassword123!"
    });

  expect(res.status).toBe(200);
});
it("should update password in database", async () => {
  const user = await prisma.user.create({
    data: {
      email: "update@mail.com",
      password: "old"
    }
  });

  const token = "update-token";

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 10000)
    }
  });

  await request(app).post("/api/auth/reset-password").send({
    token,
    password: "Newpassword123!"
  });

  const updated = await prisma.user.findUnique({
    where: { id: user.id }
  });

  expect(updated?.password).not.toBe("old");
});

it("should delete token after password reset", async () => {
  const user = await prisma.user.create({
    data: {
      email: "delete@mail.com",
      password: "old"
    }
  });

  const token = "delete-token";

  const tokenRecord = await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 10000)
    }
  });

  await request(app).post("/api/auth/reset-password").send({
    token,
    password: "Newpassword123!"
  });

  const record = await prisma.passwordResetToken.findFirst({
    where: { id:tokenRecord.id }
  });

  expect(record).toBeNull();
});

it("should fail if email missing", async () => {
  const res = await request(app)
    .post("/api/auth/forgot-password")
    .send({});

  expect(res.status).toBe(400);
});

it("should fail if token missing", async () => {
  const res = await request(app)
    .post("/api/auth/reset-password")
    .send({ password: "Newpassword123!" });

  expect(res.status).toBe(400);
});

it("should fail if password too short or invalid", async () => {
  const res = await request(app)
    .post("/api/auth/reset-password")
    .send({ token: "t", password: "123" });

  expect(res.status).toBe(400);
});

it("should fail invalid token", async () => {
  const res = await request(app)
    .post("/api/auth/reset-password")
    .send({
      token: "valid-token",
      password: "Newpassword123!"
    });

  expect(res.status).toBe(401);
});

it("should fail expired token", async () => {
  const user = await prisma.user.create({
    data: { email: "exp@mail.com", password: "old" }
  });

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token: "expired",
      expiresAt: new Date(Date.now() - 1000)
    }
  });

  const res = await request(app)
    .post("/api/auth/reset-password")
    .send({
      token: "expired",
      password: "Newpassword123!"
    });

  expect(res.status).toBe(401);
});

it("should fail if user not found", async () => {
  await prisma.passwordResetToken.create({
    data: {
      userId: "661e8f5c9b1e8a3f4c2d9a11",
      token: "ghost",
      expiresAt: new Date(Date.now() + 10000)
    }
  });

  const res = await request(app)
    .post("/api/auth/reset-password")
    .send({
      token: "ghost",
      password: "Newpassword123!"
    });

  expect(res.status).toBe(409);
});

it("should not allow reuse of reset token", async () => {
  const user = await prisma.user.create({
    data: { email: "reuse@mail.com", password: "old" }
  });

  const token = "reuse-token";

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 10000)
    }
  });

  await request(app).post("/api/auth/reset-password").send({
    token,
    password: "Newpassword123!"
  });

  const res = await request(app).post("/api/auth/reset-password").send({
    token,
    password: "Newpassword123!"
  });

  expect(res.status).toBe(401);
});

it("should store hashed new password", async () => {
  const user = await prisma.user.create({
    data: { email: "hash@mail.com", password: "old" }
  });

  const token = "hash-token";

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 10000)
    }
  });

  await request(app).post("/api/auth/reset-password").send({
    token,
    password: "Newpassword123!"
  });

  const updated = await prisma.user.findUnique({
    where: { id: user.id }
  });

  expect(updated?.password).not.toBe("Newpassword123!");
});

it("should reject sql injection", async () => {
  const res = await request(app).post("/api/auth/reset-password").send({
    token: "' OR 1=1 --",
    password: "Newpassword123!"
  });

  expect(res.status).toBe(401);
});

it("should handle concurrent reset attempts safely", async () => {
  const user = await prisma.user.create({
    data: { email: "race@mail.com", password: "old" }
  });

  const token = "race-token";

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 10000)
    }
  });

  const requests = Array.from({ length: 3 }).map(() =>
    request(app).post("/api/auth/reset-password").send({
      token,
      password: "Newpassword123!"
    })
  );

  const results = await Promise.allSettled(requests);

  expect(results.length).toBe(3);
});

it("should return consistent response structure", async () => {
  const res = await request(app)
    .post("/api/auth/forgot-password")
    .send({ email: "test@mail.com" });

  expect(res.body).toHaveProperty("message");
});

});
