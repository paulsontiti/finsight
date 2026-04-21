import { beforeAll, describe, expect, it } from "vitest";
import { PrismaRefreshTokenRepository } from "../../src/domain/repositories/refresh-token.repository.js";
import type { DBRefreshTokenProps } from "../../src/shared/types/index.js";
import "../setup/cleanDB.js"

describe("Refresh token repository",()=>{
    

    it("should create refresh token", async () => {
  const repo = new PrismaRefreshTokenRepository();

  await repo.create({
    userId: "1",
    hashedToken: "hashed",
    expiresAt: new Date()
  });

  const tokens = await repo.findByUserId("1");

  expect(tokens.length).toBeGreaterThan(0);
});

it("should find tokens by userId", async () => {
  const repo = new PrismaRefreshTokenRepository();

  await repo.create({
    userId: "user-1",
    hashedToken: "hashed",
    expiresAt: new Date()
  });

  const result = await repo.findByUserId("user-1");

  expect(result.length).toBe(1);
});

it("should delete token by id", async () => {
  const repo = new PrismaRefreshTokenRepository();

  await repo.create({
    userId: "1",
    hashedToken: "hashed",
    expiresAt: new Date()
  });

  const tokens:DBRefreshTokenProps[] = await repo.findByUserId("1") ;

  await repo.delete(tokens[0]?.id as string);

  const after = await repo.findByUserId("1");

  expect(after.length).toBe(0);
});

it("should delete all tokens for a user", async () => {
  const repo = new PrismaRefreshTokenRepository();

  await repo.create({
    userId: "user-1",
    hashedToken: "t1",
    expiresAt: new Date()
  });

  await repo.create({
    userId: "user-1",
    hashedToken: "t2",
    expiresAt: new Date()
  });

  await repo.deleteByUserId("user-1");

  const result = await repo.findByUserId("user-1");

  expect(result.length).toBe(0);
});

it("should not crash when deleting non-existent id", async () => {
  const repo = new PrismaRefreshTokenRepository();

  await expect(repo.delete("fake-id")).rejects.toThrow();
});

})