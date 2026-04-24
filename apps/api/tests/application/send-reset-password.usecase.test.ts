import { describe, expect, it, vi } from "vitest";
import {SendResetPasswordUseCase} from "../../src/application/use-cases/send-reset-password.usecase"

describe("Send Reset Password",()=>{

it("should generate reset token", async () => {
  const tokenGenerator = {
    generate: vi.fn().mockReturnValue("reset-token")
  };

  const repo = { create: vi.fn() };
  const userRepo = {
    findByEmail: vi.fn().mockResolvedValue({ id: "1" })
  };
  const mailer = { send: vi.fn() };

  const useCase = new SendResetPasswordUseCase(
    repo as any,
    userRepo as any,
    tokenGenerator as any,
    mailer as any
  );

  await useCase.execute("test@mail.com");

  expect(tokenGenerator.generate).toHaveBeenCalled();
});

it("should find user by email", async () => {
  const userRepo = {
    findByEmail: vi.fn().mockResolvedValue({ id: "1" })
  };

  const useCase = new SendResetPasswordUseCase(
    {create: vi.fn()} as any,
    userRepo as any,
    { generate: vi.fn() } as any,
    { send: vi.fn() } as any
  );

  await useCase.execute("test@mail.com");

  expect(userRepo.findByEmail).toHaveBeenCalledWith("test@mail.com");
});

it("should throw if user not found", async () => {
  const userRepo = {
    findByEmail: vi.fn().mockResolvedValue(null)
  };

  const useCase = new SendResetPasswordUseCase(
    {} as any,
    userRepo as any,
    {} as any,
    {} as any
  );

  await expect(useCase.execute("bad@mail.com"))
    .rejects.toThrow();
});

it("should store reset token", async () => {
  const repo = { create: vi.fn() };
  const userRepo = {
    findByEmail: vi.fn().mockResolvedValue({ id: "1" })
  };

  const tokenGenerator = {
    generate: vi.fn().mockReturnValue("token")
  };

  const useCase = new SendResetPasswordUseCase(
    repo as any,
    userRepo as any,
    tokenGenerator as any,
    { send: vi.fn() } as any
  );

  await useCase.execute("test@mail.com");

  expect(repo.create).toHaveBeenCalled();
});

it("should send reset email", async () => {
  const mailer = { send: vi.fn() };

  const useCase = new SendResetPasswordUseCase(
    { create: vi.fn() } as any,
    { findByEmail: vi.fn().mockResolvedValue({ id: "1" }) } as any,
    { generate: vi.fn().mockReturnValue("token") } as any,
    mailer as any
  );

  await useCase.execute("test@mail.com");

  expect(mailer.send).toHaveBeenCalled();
});

it("should include token in email body", async () => {
  const mailer = { send: vi.fn() };

  const useCase = new SendResetPasswordUseCase(
    { create: vi.fn() } as any,
    { findByEmail: vi.fn().mockResolvedValue({ id: "1" }) } as any,
    { generate: vi.fn().mockReturnValue("token123") } as any,
    mailer as any
  );

  await useCase.execute("test@mail.com");

  const call = mailer.send.mock.calls[0][0];

  expect(call.body).toContain("token123");
});

it("should set expiry date", async () => {
  const repo = { create: vi.fn() };

  const useCase = new SendResetPasswordUseCase(
    repo as any,
    { findByEmail: vi.fn().mockResolvedValue({ id: "1" }) } as any,
    { generate: vi.fn().mockReturnValue("token") } as any,
    { send: vi.fn() } as any
  );

  await useCase.execute("test@mail.com");

  const data = repo.create.mock.calls[0][0];

  expect(data.expiresAt).toBeInstanceOf(Date);
});

})