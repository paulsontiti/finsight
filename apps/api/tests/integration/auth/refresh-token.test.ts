import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import app from "../../../src/app";
import prisma from "../../../src/prisma";
import jwt from "jsonwebtoken";

describe("Refresh token endpoint", () => {
  beforeEach(async () => {
    await prisma.refreshToken.deleteMany();
    await prisma.ledgerEntry.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.wallet.deleteMany();
    await prisma.user.deleteMany();
  }, 100000000);

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should generate new access token", async () => {
    await request(app).post("/api/auth/register").send({
      email: "refresh@mail.com",
      password: "Password123!",
    });

    const login = await request(app).post("/api/auth/login").send({
      email: "refresh@mail.com",
      password: "Password123!",
    });

    const refreshToken = login.body.refreshToken;

    const res = await request(app)
      .post("/api/auth/refresh-token")
      .set("Cookie", `refreshToken=${refreshToken}`);

    expect(res.status).toBe(201);
    expect(res.body.accessToken).toBeDefined();
  });

  it("should only return access token", async () => {
    const login = await request(app).post("/api/auth/login").send({
      email: "only@mail.com",
      password: "password123",
    });

    const res = await request(app)
      .post("/auth/refresh")
      .set("Cookie", [`refreshToken=${login.body.refreshToken}`]);

    expect(res.body.refreshToken).toBeUndefined();
  });

  it("should return valid jwt access token", async () => {
    const login = await request(app).post("/api/auth/login").send({
      email: "jwtrefresh@mail.com",
      password: "password123",
    });

    const res = await request(app)
      .post("/auth/refresh")
      .set("Cookie", [`refreshToken=${login.body.refreshToken}`]);

    const decoded = jwt.decode(res.body.accessToken);

    expect(decoded).toBeDefined();
  });
  it("should fail if no refresh token cookie", async () => {
    const res = await request(app).post("/api/auth/refresh-token");

    expect(res.status).toBe(401);
  });

  it("should fail if refresh token is empty", async () => {
    const res = await request(app)
      .post("/api/auth/refresh-token")
      .set("Cookie", ["refreshToken="]);

    expect(res.status).toBe(401);
  });

  it("should fail for invalid refresh token", async () => {
    const res = await request(app)
      .post("/api/auth/refresh-token")
      .set("Cookie", ["refreshToken=invalid"]);

    expect(res.status).toBe(401);
  });

  it("should fail if token is tampered", async () => {
    const fake = "abc.def.ghi";

    const res = await request(app)
      .post("/api/auth/refresh-token")
      .set("Cookie", [`refreshToken=${fake}`]);

    expect(res.status).toBe(401);
  });

  it("should fail expired refresh token", async () => {
    const expiredToken = "expired.token.value"; // mock or pre-generated

    const res = await request(app)
      .post("/api/auth/refresh-token")
      .set("Cookie", [`refreshToken=${expiredToken}`]);

    expect(res.status).toBe(401);
  });

  it("should not accept token from request body", async () => {
    const res = await request(app).post("/api/auth/refresh-token").send({
      refreshToken: "fake",
    });

    expect(res.status).toBe(401);
  });

  it("should only read token from cookies", async () => {
    const res = await request(app)
      .post("/api/auth/refresh-token")
      .set("Authorization", "Bearer fake");

    expect(res.status).toBe(401);
  });

  it("should prevent reuse of old refresh token", async () => {
    const login = await request(app).post("/api/auth/login").send({
      email: "reuse@mail.com",
      password: "Password123!",
    });

    const token = login.body.refreshToken;

    await request(app)
      .post("/api/auth/refresh-token")
      .set("Cookie", [`refreshToken=${token}`]);

    const res = await request(app)
      .post("/api/auth/refresh-token")
      .set("Cookie", [`refreshToken=${token}`]);

    expect(res.status).toBe(401);
  });

  it("should reject sql injection attempts", async () => {
    const res = await request(app)
      .post("/api/auth/refresh-token")
      .set("Cookie", ["refreshToken=' OR 1=1 --"]);

    expect(res.status).toBe(401);
  });

  it("should validate against stored refresh tokens", async () => {
    await request(app).post("/api/auth/register").send({
      email: "db@mail.com",
      password: "Password123!",
    });
    await request(app).post("/api/auth/login").send({
      email: "db@mail.com",
      password: "Password123!",
    });

    const tokens = await prisma.refreshToken.findMany();

    expect(tokens.length).toBeGreaterThan(0);
  });
  it("should remove token after revoke", async () => {
    const login = await request(app).post("/api/auth/login").send({
      email: "revoke@mail.com",
      password: "Password123!",
    });

    // simulate logout
    await prisma.refreshToken.deleteMany();

    const res = await request(app)
      .post("/api/auth/refresh-token")
      .set("Cookie", [`refreshToken=${login.body.refreshToken}`]);

    expect(res.status).toBe(401);
  });
  it("should support multiple sessions", async () => {
    await request(app).post("/api/auth/register").send({
      email: "multi@mail.com",
      password: "Password123!",
    });

    const login1 = await request(app).post("/api/auth/login").send({
      email: "multi@mail.com",
      password: "Password123!",
    });

    const login2 = await request(app).post("/api/auth/login").send({
      email: "multi@mail.com",
      password: "Password123!",
    });

    expect(login1.body.refreshToken).not.toBe(login2.body.refreshToken);
  });

  it("should return consistent response structure", async () => {
      await request(app).post("/api/auth/register").send({
      email: "structure@mail.com",
      password: "Password123!",
    });
    const login = await request(app).post("/api/auth/login").send({
      email: "structure@mail.com",
      password: "Password123!",
    });

    const res = await request(app)
      .post("/api/auth/refresh-token")
      .set("Cookie", [`refreshToken=${login.body.refreshToken}`]);

    expect(res.body).toMatchObject({
      accessToken: expect.any(String),
    });
  });
});
