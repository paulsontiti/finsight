import { describe, expect, it, vi } from "vitest";
import { ResetPasswordUseCase } from "../../src/application/use-cases/reset-password.usecase.js";


describe("Reset Password",()=>{

    it("should reset password successfully", async () => {
  const tokenRepo = {
    find: vi.fn().mockResolvedValue({
      userId: "1",
      expiresAt: new Date(Date.now() + 10000),
      id: "t1"
    }),
    delete: vi.fn()
  };

  const user = {
    setPassword: vi.fn()
  };

  const userRepo = {
    findById: vi.fn().mockResolvedValue(user),
    update: vi.fn()
  };

  const hashService = {
    hash: vi.fn().mockResolvedValue("hashed")
  };

  const useCase = new ResetPasswordUseCase(
    tokenRepo as any,
    userRepo as any,
    hashService as any
  );

  await useCase.execute({token:"token", newPassword:"pass"});

  expect(userRepo.update).toHaveBeenCalled();
});

it("should throw if token not found", async () => {
  const tokenRepo = {
    find: vi.fn().mockResolvedValue(null)
  };

  const useCase = new ResetPasswordUseCase(
    tokenRepo as any,
    {} as any,
    {} as any
  );

  await expect(useCase.execute({token:"token", newPassword:"pass"}))
    .rejects.toThrow();
});

it("should throw if token expired", async () => {
  const tokenRepo = {
    find: vi.fn().mockResolvedValue({
      expiresAt: new Date(Date.now() - 1000)
    })
  };

  const useCase = new ResetPasswordUseCase(
    tokenRepo as any,
    {} as any,
    {} as any
  );

  await expect(useCase.execute({token:"token", newPassword:"pass"}))
    .rejects.toThrow();
});

it("should hash new password", async () => {
  const hashService = {
    hash: vi.fn().mockResolvedValue("hashed-pass")
  };

  const tokenRepo = {
    find: vi.fn().mockResolvedValue({
      userId: "1",
      expiresAt: new Date(Date.now() + 10000),
      id: "t1"
    }),
    delete: vi.fn()
  };

  const user = {
    setPassword: vi.fn()
  };

  const userRepo = {
    findById: vi.fn().mockResolvedValue(user),
    update: vi.fn()
  };

  const useCase = new ResetPasswordUseCase(
    tokenRepo as any,
    userRepo as any,
    hashService as any
  );

  await useCase.execute({token:"token", newPassword:"pass"});

  expect(hashService.hash).toHaveBeenCalled();
});

it("should delete token after reset", async () => {
  const tokenRepo = {
    find: vi.fn().mockResolvedValue({
      userId: "1",
      expiresAt: new Date(Date.now() + 10000),
      id: "t1"
    }),
    delete: vi.fn()
  };

  const userRepo = {
    findById: vi.fn().mockResolvedValue({ setPassword: vi.fn() }),
    update: vi.fn()
  };

  const useCase = new ResetPasswordUseCase(
    tokenRepo as any,
    userRepo as any,
    { hash: vi.fn().mockResolvedValue("hashed") } as any
  );

  await useCase.execute({token:"token", newPassword:"pass"});

  expect(tokenRepo.delete).toHaveBeenCalledWith("t1");
});

it("should throw if user not found", async () => {
  const tokenRepo = {
    find: vi.fn().mockResolvedValue({
      userId: "1",
      expiresAt: new Date(Date.now() + 10000),
      id: "t1"
    })
  };

  const userRepo = {
    findById: vi.fn().mockResolvedValue(null)
  };

  const useCase = new ResetPasswordUseCase(
    tokenRepo as any,
    userRepo as any,
    {} as any
  );

  await expect(useCase.execute({token:"token", newPassword:"pass"}))
    .rejects.toThrow();
});


})