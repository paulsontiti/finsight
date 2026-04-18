import { describe, it, expect, vi } from "vitest";
import { LoginUserUseCase } from "../../src/application/use-cases/login-user.usecase.js";
import { Role } from "../../generated/prisma/enums.js";

describe("LoginUserUseCase", () => {

  it("should login user successfully", async () => {
    const repo = {
      findByEmail: vi.fn().mockResolvedValue({
        id: "1",
        email: "test@mail.com",
        password: "hashed"
      })
    };

    const hashService = {
      compare: vi.fn().mockResolvedValue(true)
    };

    const tokenService = {
      sign: vi.fn().mockReturnValue("token")
    };

    const useCase = new LoginUserUseCase(
      repo as any,
      hashService as any,
      tokenService as any
    );

    const result = await useCase.execute({
      email: "test@mail.com",
      password: "Password123!"
    });

    expect(result.token).toBe("token");
  });

  it("should throw if user does not exist", async () => {
  const repo = {
    findByEmail: vi.fn().mockResolvedValue(null)
  };

  const hashService = { compare: vi.fn() };
  const tokenService = { sign: vi.fn() };

  const useCase = new LoginUserUseCase(
    repo as any,
    hashService as any,
    tokenService as any
  );

  await expect(
    useCase.execute({
      email: "test@mail.com",
      password: "Password123!"
    })
  ).rejects.toThrow();
});

it("should throw if password is incorrect", async () => {
  const repo = {
    findByEmail: vi.fn().mockResolvedValue({
      id: "1",
      email: "test@mail.com",
      password: "hashed"
    })
  };

  const hashService = {
    compare: vi.fn().mockResolvedValue(false)
  };

  const tokenService = { sign: vi.fn() };

  const useCase = new LoginUserUseCase(
    repo as any,
    hashService as any,
    tokenService as any
  );

  await expect(
    useCase.execute({
      email: "test@mail.com",
      password: "wrong"
    })
  ).rejects.toThrow();
});

it("should compare password with hash", async () => {
  const repo = {
    findByEmail: vi.fn().mockResolvedValue({
      id: "1",
      email: "test@mail.com",
      password: "hashed"
    })
  };

  const hashService = {
    compare: vi.fn().mockResolvedValue(true)
  };

  const tokenService = { sign: vi.fn().mockReturnValue("token") };

  const useCase = new LoginUserUseCase(
    repo as any,
    hashService as any,
    tokenService as any
  );

  await useCase.execute({
    email: "test@mail.com",
    password: "Password123!"
  });

  expect(hashService.compare).toHaveBeenCalledWith(
    "Password123!",
    "hashed"
  );
});

it("should generate token with user id", async () => {
  const repo = {
    findByEmail: vi.fn().mockResolvedValue({
      id: "1",
      email: "test@mail.com",
      password: "hashed"
    })
  };

  const hashService = {
    compare: vi.fn().mockResolvedValue(true)
  };

  const tokenService = {
    sign: vi.fn().mockReturnValue("token")
  };

  const useCase = new LoginUserUseCase(
    repo as any,
    hashService as any,
    tokenService as any
  );

  await useCase.execute({
    email: "test@mail.com",
    password: "Password123!"
  });

  expect(tokenService.sign).toHaveBeenCalledWith({
    user:{userId: "1"},role: Role.APPUSER
  });
});

it("should normalize email before lookup", async () => {
  const repo = {
    findByEmail: vi.fn().mockResolvedValue({
      id: "1",
      email: "test@mail.com",
      password: "hashed"
    })
  };

  const hashService = {
    compare: vi.fn().mockResolvedValue(true)
  };

  const tokenService = {
    sign: vi.fn().mockReturnValue("token")
  };

  const useCase = new LoginUserUseCase(
    repo as any,
    hashService as any,
    tokenService as any
  );

  await useCase.execute({
    email: "TEST@MAIL.COM",
    password: "Password123!"
  });

  expect(repo.findByEmail).toHaveBeenCalledWith("test@mail.com");
});

});