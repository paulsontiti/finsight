import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";
import prisma from "../../src/prisma";
import { LoginUserUseCase } from "../../src/application/use-cases/login-user.usecase.js";

describe("LoginUserUseCase", () => {
  beforeEach(async () => {
    await prisma.ledgerEntry.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.wallet.deleteMany();
    await prisma.user.deleteMany();
  }, 100000);

  afterAll(async () => {
    await prisma.$disconnect();
  });
  it("should login user successfully", async () => {
    const repo = {
      findByEmail: vi.fn().mockResolvedValue({
        id: "1",
        email: "test@mail.com",
        password: "hashed",
      }),
    };

    const hashService = {
      compare: vi.fn().mockResolvedValue(true),
    };

    const tokenService = {
      signAccessToken: vi.fn().mockReturnValue("token"),
      signRefreshToken: vi.fn().mockReturnValue("refresh-token"),
    };

    const refreshToken = {
      create: vi.fn(),
    };
    const useCase = new LoginUserUseCase(
      repo as any,
      hashService as any,
      tokenService as any,
      refreshToken as any,
    );

    const result = await useCase.execute({
      email: "test@mail.com",
      password: "Password123!",
    });

    expect(result.accessToken).toBe("token");
  });

  it("should throw if user does not exist", async () => {
    const repo = {
      findByEmail: vi.fn().mockResolvedValue(null),
    };

    const hashService = { compare: vi.fn() };
    const tokenService = {
      signAccessToken: vi.fn(),
      signRefreshToken: vi.fn(),
    };
    const refreshToken = {
      create: vi.fn(),
    };
    const useCase = new LoginUserUseCase(
      repo as any,
      hashService as any,
      tokenService as any,
      refreshToken as any,
    );

    await expect(
      useCase.execute({
        email: "test@mail.com",
        password: "Password123!",
      }),
    ).rejects.toThrow();
  });

  it("should throw if password is incorrect", async () => {
    const repo = {
      findByEmail: vi.fn().mockResolvedValue({
        id: "1",
        email: "test@mail.com",
        password: "hashed",
      }),
    };

    const hashService = {
      compare: vi.fn().mockResolvedValue(false),
    };

    const tokenService = {
      signAccessToken: vi.fn(),
      signRefreshToken: vi.fn(),
    };
    const refreshToken = {
      create: vi.fn(),
    };
    const useCase = new LoginUserUseCase(
      repo as any,
      hashService as any,
      tokenService as any,
      refreshToken as any,
    );

    await expect(
      useCase.execute({
        email: "test@mail.com",
        password: "wrong",
      }),
    ).rejects.toThrow();
  });
  it("should compare password with hash", async () => {
    const repo = {
      findByEmail: vi.fn().mockResolvedValue({
        id: "1",
        email: "test@mail.com",
        password: "hashed",
      }),
    };

    const hashService = {
      compare: vi.fn().mockResolvedValue(true),
    };

    const tokenService = {
      signAccessToken: vi.fn(),
      signRefreshToken: vi.fn(),
    };
    const refreshToken = {
      create: vi.fn(),
    };
    const useCase = new LoginUserUseCase(
      repo as any,
      hashService as any,
      tokenService as any,
      refreshToken as any,
    );

    await useCase.execute({
      email: "test@mail.com",
      password: "Password123!",
    });

    expect(hashService.compare).toHaveBeenCalledWith("Password123!", "hashed");
  });

  it("should generate token with user id", async () => {
    const repo = {
      findByEmail: vi.fn().mockResolvedValue({
        id: "1",
        email: "test@mail.com",
        password: "hashed",
      }),
    };

    const hashService = {
      compare: vi.fn().mockResolvedValue(true),
    };

    const tokenService = {
      signAccessToken: vi.fn(),
      signRefreshToken: vi.fn(),
    };
    const refreshToken = {
      create: vi.fn(),
    };
    const useCase = new LoginUserUseCase(
      repo as any,
      hashService as any,
      tokenService as any,
      refreshToken as any,
    );

    await useCase.execute({
      email: "test@mail.com",
      password: "Password123!",
    });

    expect(tokenService.signAccessToken).toHaveBeenCalledWith({
      userId: "1",
    });
  });

  it("should normalize email before lookup", async () => {
    const repo = {
      findByEmail: vi.fn().mockResolvedValue({
        id: "1",
        email: "test@mail.com",
        password: "hashed",
      }),
    };

    const hashService = {
      compare: vi.fn().mockResolvedValue(true),
    };

    const tokenService = {
      signAccessToken: vi.fn(),
      signRefreshToken: vi.fn(),
    };
    const refreshToken = {
      create: vi.fn(),
    };
    const useCase = new LoginUserUseCase(
      repo as any,
      hashService as any,
      tokenService as any,
      refreshToken as any,
    );

    await useCase.execute({
      email: "TEST@MAIL.COM",
      password: "Password123!",
    });

    expect(repo.findByEmail).toHaveBeenCalledWith("test@mail.com");
  });
});
