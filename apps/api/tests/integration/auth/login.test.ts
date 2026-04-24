import { afterAll, beforeEach, describe, expect, it } from "vitest";
import app from "../../../src/app";
import request from "supertest";
import prisma from "../../../src/prisma";
import jwt from "jsonwebtoken";

describe("Login Endpoint", () => {
  beforeEach(async () => {
    await prisma.refreshToken.deleteMany();
    await prisma.ledgerEntry.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.wallet.deleteMany();
    await prisma.user.deleteMany();
  }, 1000000);

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should login user and return tokens", async () => {
    await request(app).post("/api/auth/register").send({
      email: "test@mail.com",
      password: "Password123!",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "test@mail.com",
      password: "Password123!",
    });

    expect(res.status).toBe(201);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
  });

  it("should set refresh token cookie", async () => {
    await request(app).post("/api/auth/register").send({
      email: "cookie@mail.com",
      password: "Password123!",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "cookie@mail.com",
      password: "Password123!",
    });

    const cookies = res.headers["set-cookie"] as unknown;

    expect(cookies).toBeDefined();

    const refreshCookie =
      Array.isArray(cookies) &&
      cookies.find((cookie: string) => cookie.startsWith("refreshToken="));

    expect(refreshCookie).toBeDefined();
    expect(refreshCookie).toContain("HttpOnly");
  });

  it("should return user data without password", async () => {
    await request(app).post("/api/auth/register").send({
      email: "data@mail.com",
      password: "Password123!",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "data@mail.com",
      password: "Password123!",
    });

    expect(res.body.user.email).toBe("data@mail.com");
    expect(res.body.user.password).toBeUndefined();
  });

  it("should fail if email is missing", async () => {
    const res = await request(app).post("/api/auth/login").send({
      password: "Password123!",
    });

    expect(res.status).toBe(401);
  });
  it("should fail if password is missing", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "test@mail.com",
    });

    expect(res.status).toBe(401);
  });

  it("should fail invalid email format", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "invalid",
      password: "Password123!",
    });

    expect(res.status).toBe(401);
  });

  it("should fail if user does not exist", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "nouser@mail.com",
      password: "Password123!",
    });

    expect(res.status).toBe(404);
  });

  it("should fail if password is incorrect", async () => {
    await request(app).post("/api/auth/register").send({
      email: "wrong@mail.com",
      password: "Password123!",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "wrong@mail.com",
      password: "Password12!",
    });

    expect(res.status).toBe(401);
  });

  it("should not reveal if email or password is wrong", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "unknown@mail.com",
      password: "Password123!",
    });

    expect(res.body.message).not.toContain("email");
  });

  it("should validate hashed password", async () => {
    await request(app).post("/api/auth/register").send({
      email: "hashcheck@mail.com",
      password: "Password123!",
    });

    const user = await prisma.user.findUnique({
      where: { email: "hashcheck@mail.com" },
    });

    expect(user?.password).not.toBe("Password123!");
  });

  it("should reject sql injection attempt", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "' OR 1=1 --",
      password: "Password123!",
    });

    expect(res.status).toBe(401);
  });

  it("should reject extremely long input", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "a".repeat(5000) + "@mail.com",
        password: "password123",
      });

    expect(res.status).toBe(401);
  });

  it("should generate valid jwt", async () => {
    await request(app).post("/api/auth/register").send({
      email: "jwt@mail.com",
      password: "Password123!",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "jwt@mail.com",
      password: "Password123!",
    });

    const decoded = jwt.decode(res.body.accessToken);

    expect(decoded).toBeDefined();
  });

  it("should include userId in token payload", async () => {
    await request(app).post("/api/auth/register").send({
      email: "payload@mail.com",
      password: "Password123!",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "payload@mail.com",
      password: "Password123!",
    });

    const decoded: any = jwt.decode(res.body.accessToken);

    expect(decoded.userId).toBeDefined();
  });

  it("should normalize email before login", async () => {
    await request(app).post("/api/auth/register").send({
      email: "case@mail.com",
      password: "Password123!",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "CASE@mail.com",
      password: "Password123!",
    });

    expect(res.status).toBe(201);
  });

  it("should allow multiple login sessions", async () => {
    await request(app).post("/api/auth/register").send({
      email: "multi@mail.com",
      password: "Password123!",
    });

    const requests = Array.from({ length: 3 }).map(() =>
      request(app).post("/api/auth/login").send({
        email: "multi@mail.com",
        password: "Password123!",
      }),
    );

    const results = await Promise.all(requests);

    results.forEach((res) => {
      expect(res.status).toBe(201);
    });
  });

  it("should return consistent response", async () => {
    await request(app).post("/api/auth/register").send({
      email: "structure@mail.com",
      password: "Password123!",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "structure@mail.com",
      password: "Password123!",
    });

    expect(res.body).toMatchObject({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
  });
});
