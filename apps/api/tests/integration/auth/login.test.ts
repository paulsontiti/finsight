import { afterAll, beforeEach, describe, expect, it } from "vitest";
import app from "../../../src/app";
import request from "supertest";
import prisma from "../../../src/prisma";

describe("Login Endpoint", () => {
  beforeEach(async () => {
    await prisma.refreshToken.deleteMany();
    await prisma.ledgerEntry.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.wallet.deleteMany();
    await prisma.user.deleteMany();
  }, 10000000);

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

    expect(res.status).toBe(409);
  });

  it("should fail if password is incorrect", async () => {
  await request(app).post("/api/auth/register").send({
    email: "wrong@mail.com",
    password: "Password123!"
  });

  const res = await request(app).post("/api/auth/login").send({
    email: "wrong@mail.com",
    password: "Password12!"
  });

  expect(res.status).toBe(401);
});

});
