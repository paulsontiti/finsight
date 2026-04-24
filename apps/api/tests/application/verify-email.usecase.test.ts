import { describe, expect, it, vi } from "vitest";
import {VerifyEmailUseCase} from "../../src/application/use-cases/verify-email.usecase"

describe("Verify Email",()=>{

    it("should verify user successfully", async () => {
  const tokenRepo = {
    find: vi.fn().mockResolvedValue({
      userId: "1",
      token: "token",
      expiresAt: new Date(Date.now() + 10000)
    }),
    delete: vi.fn()
  };

  const userRepo = {
    findById: vi.fn().mockResolvedValue({
      markVerified: vi.fn()
    }),
    update: vi.fn()
  };

  const useCase = new VerifyEmailUseCase(
    tokenRepo as any,
    userRepo as any
  );

  await useCase.execute("token");

  expect(userRepo.update).toHaveBeenCalled();
});

it("should throw if token not found", async () => {
  const tokenRepo = {
    find: vi.fn().mockResolvedValue(null)
  };

  const userRepo = {};

  const useCase = new VerifyEmailUseCase(
    tokenRepo as any,
    userRepo as any
  );

  await expect(useCase.execute("bad")).rejects.toThrow();
});

it("should throw if token expired", async () => {
  const tokenRepo = {
    find: vi.fn().mockResolvedValue({
      expiresAt: new Date(Date.now() - 1000)
    })
  };

  const userRepo = {};

  const useCase = new VerifyEmailUseCase(
    tokenRepo as any,
    userRepo as any
  );

  await expect(useCase.execute("token")).rejects.toThrow();
});

it("should delete token after verification", async () => {
  const tokenRepo = {
    find: vi.fn().mockResolvedValue({
      userId: "1",
      expiresAt: new Date(Date.now() + 10000)
    }),
    delete: vi.fn()
  };

  const userRepo = {
    findById: vi.fn().mockResolvedValue({
      markVerified: vi.fn()
    }),
    update: vi.fn()
  };

  const useCase = new VerifyEmailUseCase(
    tokenRepo as any,
    userRepo as any
  );

  await useCase.execute("token");

  expect(tokenRepo.delete).toHaveBeenCalled();
});

it("should mark user as verified", async () => {
  const user = {
    markVerified: vi.fn()
  };

  const tokenRepo = {
    find: vi.fn().mockResolvedValue({
      userId: "1",
      expiresAt: new Date(Date.now() + 10000)
    }),
    delete: vi.fn()
  };

  const userRepo = {
    findById: vi.fn().mockResolvedValue(user),
    update: vi.fn()
  };

  const useCase = new VerifyEmailUseCase(
    tokenRepo as any,
    userRepo as any
  );

  await useCase.execute("token");

  expect(userRepo.update).toHaveBeenCalled();
});

})