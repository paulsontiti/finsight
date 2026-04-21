
import { describe, vi,it,expect } from "vitest";
import { SendVerificationUseCase } from "../../src/application/use-cases/send-verification.usecase.js";

const verificationProp = {userId:"user-1", email:"test@mail.com"}

describe("Send verification usecase",()=>{

    it("should generate verification token", async () => {
  const tokenService = {
    generate: vi.fn().mockReturnValue("token123")
  };

  const repo = { create: vi.fn() };
  const mailer = { send: vi.fn() };

  const useCase = new SendVerificationUseCase(
    repo as any,
    tokenService as any,
    mailer as any
  );

  await useCase.execute(verificationProp);

  expect(tokenService.generate).toHaveBeenCalled();
});

it("should store verification token", async () => {
  const repo = { create: vi.fn() };
  const tokenService = { generate: vi.fn().mockReturnValue("token") };
  const mailer = { send: vi.fn() };

  const useCase = new SendVerificationUseCase(
    repo as any,
    tokenService as any,
    mailer as any
  );

  await useCase.execute(verificationProp);

  expect(repo.create).toHaveBeenCalled();
});

it("should send verification email", async () => {
  const repo = { create: vi.fn() };
  const tokenService = { generate: vi.fn().mockReturnValue("token") };
  const mailer = { send: vi.fn() };

  const useCase = new SendVerificationUseCase(
    repo as any,
    tokenService as any,
    mailer as any
  );

  await useCase.execute(verificationProp);

  expect(mailer.send).toHaveBeenCalled();
});

it("should include token in email", async () => {
  const repo = { create: vi.fn() };
  const tokenService = { generate: vi.fn().mockReturnValue("token123") };
  const mailer = { send: vi.fn() };

  const useCase = new SendVerificationUseCase(
    repo as any,
    tokenService as any,
    mailer as any
  );

  await useCase.execute(verificationProp);

  const emailCall = mailer.send.mock.calls[0]?.[0];

  expect(emailCall.body).toContain("token123");
});

it("should set expiry date", async () => {
  const repo = { create: vi.fn() };
  const tokenService = { generate: vi.fn().mockReturnValue("token") };
  const mailer = { send: vi.fn() };

  const useCase = new SendVerificationUseCase(
    repo as any,
    tokenService as any,
    mailer as any
  );

  await useCase.execute({userId:"user-1", email:"test@mail.com"});

  const data = repo.create.mock.calls[0]?.[0];

  expect(data.expiresAt).toBeInstanceOf(Date);
});
})