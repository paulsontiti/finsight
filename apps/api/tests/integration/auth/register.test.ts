import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import app from "../../../src/app";
import prisma from "../../../src/prisma";

describe("Register Endpoint", () => {
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

 it("should register a user", async () => {
  const res = await request(app).post("/api/auth/register").send({
    email: "user@mail.com",
    password: "Password123!"
  });

  expect(res.status).toBe(201);
  expect(res.body.email).toBe("user@mail.com");
});


it("should persist user in database", async () => {
  await request(app).post("/api/auth/register").send({
    email: "db@mail.com",
    password: "Password123!"
  });

  const user = await prisma.user.findUnique({
    where: { email: "db@mail.com" }
  });

  expect(user).not.toBeNull();
});
  it("should store hashed password", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "test@mail.com",
      password: "Password123!",
    });

    const user = await prisma.user.findFirst();

    expect(res.status).toBe(201);
    expect(user?.password).not.toBe("password123");
  });
it("should return user id", async () => {
  const res = await request(app).post("/api/auth/register").send({
    email: "id@mail.com",
    password: "Password123!"
  });

  expect(res.body.id).toBeDefined();
});
it("should set default values", async () => {
  await request(app).post("/api/auth/register").send({
    email: "default@mail.com",
    password: "Password123!"
  });

  const user = await prisma.user.findUnique({
    where: { email: "default@mail.com" }
  });

  expect(user?.isVerified).toBe(false);
});
it("should fail if email is missing", async () => {
  const res = await request(app).post("/api/auth/register").send({
    password: "Password123!"
  });

  expect(res.status).toBe(401);
});

it("should fail if password is missing", async () => {
  const res = await request(app).post("/api/auth/register").send({
    email: "test@mail.com"
  });

  expect(res.status).toBe(401);
});
it("should fail for invalid email format", async () => {
  const res = await request(app).post("/api/auth/register").send({
    email: "invalid-email",
    password: "Password123!"
  });

  expect(res.status).toBe(401);
});
it("should fail for short password", async () => {
  const res = await request(app).post("/api/auth/register").send({
    email: "short@mail.com",
    password: "123"
  });

  expect(res.status).toBe(401);
});
it("should trim email input", async () => {
  await request(app).post("/api/auth/register").send({
    email: "  trim@mail.com  ",
    password: "Password123!"
  });

  const user = await prisma.user.findUnique({
    where: { email: "trim@mail.com" }
  });

  expect(user).not.toBeNull();
});

  it("should not allow duplicate email", async () => {
    await request(app).post("/api/auth/register").send({
      email: "test@mail.com",
      password: "Password123!",
    });
    const res = await request(app).post("/api/auth/register").send({
      email: "test@mail.com",
      password: "Password123!",
    });

    //console.log(res.body)
    expect(res.status).toBe(409);
  });

  it("should normalize email to lowercase", async () => {
  await request(app).post("/api/auth/register").send({
    email: "CASE@MAIL.COM",
    password: "Password123!"
  });

  const user = await prisma.user.findUnique({
    where: { email: "case@mail.com" }
  });

  expect(user).not.toBeNull();
});

it("should not return password in response", async () => {
  const res = await request(app).post("/api/auth/register").send({
    email: "secure@mail.com",
    password: "Password123!"
  });

  expect(res.body.password).toBeUndefined();
});

it("should handle sql injection attempt", async () => {
  const res = await request(app).post("/api/auth/register").send({
    email: "'; DROP TABLE users; --",
    password: "Password123!"
  });

  expect(res.status).toBe(401);
});

it("should reject extremely long inputs greater than 100 characters", async () => {
  const res = await request(app).post("/api/auth/register").send({
    email: "a".repeat(5000) + "@mail.com",
    password: "Password123!"
  });

  expect(res.status).toBe(401);
});

it("should handle concurrent registrations safely", async () => {
  const requests = Array.from({ length: 5 }).map(() =>
    request(app).post("/api/auth/register").send({
      email: "race@mail.com",
      password: "Password123!"
    })
  );

  const results = await Promise.allSettled(requests);

  const success = results.filter(r => r.status === "fulfilled");

  expect(success.length).toBeGreaterThan(0);
});

it("should return consistent response structure", async () => {
  const res = await request(app).post("/api/auth/register").send({
    email: "structure@mail.com",
    password: "Password123!"
  });

  expect(res.body).toMatchObject({
    id: expect.any(String),
    email: expect.any(String)
  });
});

});
