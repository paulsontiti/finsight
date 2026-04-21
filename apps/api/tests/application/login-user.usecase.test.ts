import { describe, it, expect, vi, beforeAll } from "vitest";
import { LoginUserUseCase } from "../../src/application/use-cases/login-user.usecase.js";
import { Role } from "../../generated/prisma/enums.js";
import { RefreshTokenService } from "../../src/services/refresh-token.service.js";

import "../setup/cleanDB.js"



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
      compare: vi.fn().mockResolvedValue(true),
      hash: vi.fn().mockResolvedValue("hashed")
    };

    const tokenService = {
      signAccessToken: vi.fn().mockReturnValue("token"),
      signRefreshToken: vi.fn().mockReturnValue("refreshToken"),
    };

       const refreshRepo = {
      create: vi.fn().mockResolvedValue({
        id: "1",
        email: "test@mail.com",
        password: "hashed",
      }),
      findByUserId: vi.fn().mockResolvedValue({
        id: "1",
        email: "test@mail.com",
        password: "hashed",
      }),
      deleteByUserId: vi.fn().mockResolvedValue({
        id: "1",
        email: "test@mail.com",
        password: "hashed",
      }),
      delete: vi.fn().mockResolvedValue({
        id: "1",
        email: "test@mail.com",
        password: "hashed",
      }),
    };

        const refreshTokenService = new RefreshTokenService(
      refreshRepo,
      hashService,
    );
    const useCase = new LoginUserUseCase(
      repo as any,
      hashService as any,
      tokenService as any,refreshTokenService as any
    );

    const result = await useCase.execute({
      email: "test@mail.com",
      password: "Password123!"
    });

    expect(result.accessToken).toBe("token");
  });

 
  it("should throw if user does not exist", async () => {
    const repo = {
      findByEmail: vi.fn().mockResolvedValue(null),
    };

    const hashService = {
      compare: vi.fn(),
      hash: vi.fn().mockResolvedValue("hashed"),
    };
    const tokenService = {
      signAccessToken: vi.fn().mockReturnValue("token"),
      signRefreshToken: vi.fn().mockReturnValue("refreshToken"),
    };
    const refreshRepo = {
      create: vi.fn().mockResolvedValue({
        id: "1",
        email: "test@mail.com",
        password: "hashed",
      }),
      findByUserId: vi.fn().mockResolvedValue({
        id: "1",
        email: "test@mail.com",
        password: "hashed",
      }),
      deleteByUserId: vi.fn().mockResolvedValue({
        id: "1",
        email: "test@mail.com",
        password: "hashed",
      }),
      delete: vi.fn().mockResolvedValue({
        id: "1",
        email: "test@mail.com",
        password: "hashed",
      }),
    };

    const refreshTokenService = new RefreshTokenService(
      refreshRepo,
      hashService,
    );
    const useCase = new LoginUserUseCase(
      repo as any,
      hashService as any,
      tokenService as any,
      refreshTokenService as any,
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
      compare: vi.fn(),
      hash: vi.fn().mockResolvedValue("hashed"),
    };
    const tokenService = {
      signAccessToken: vi.fn().mockReturnValue("token"),
      signRefreshToken: vi.fn().mockReturnValue("refreshToken"),
    };
    const refreshRepo = {
      create: vi.fn().mockResolvedValue({
        id: "1",
        email: "test@mail.com",
        password: "hashed",
      }),
      findByUserId: vi.fn().mockResolvedValue({
        id: "1",
        email: "test@mail.com",
        password: "hashed",
      }),
      deleteByUserId: vi.fn().mockResolvedValue({
        id: "1",
        email: "test@mail.com",
        password: "hashed",
      }),
      delete: vi.fn().mockResolvedValue({
        id: "1",
        email: "test@mail.com",
        password: "hashed",
      }),
    };
    const refreshTokenService = new RefreshTokenService(
      refreshRepo,
      hashService,
    );
    const useCase = new LoginUserUseCase(
      repo as any,
      hashService as any,
      tokenService as any,
      refreshTokenService as any,
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
      hash: vi.fn().mockResolvedValue("hashed"),
    };

    const tokenService = {
      signAccessToken: vi.fn().mockReturnValue("token"),
      signRefreshToken: vi.fn().mockReturnValue("refreshToken"),
    };

    const refreshRepo = {
      create: vi.fn().mockResolvedValue({
        id: "1",
        email: "test@mail.com",
        password: "hashed",
      }),
      findByUserId: vi.fn().mockResolvedValue({
        id: "1",
        email: "test@mail.com",
        password: "hashed",
      }),
      deleteByUserId: vi.fn().mockResolvedValue({
        id: "1",
        email: "test@mail.com",
        password: "hashed",
      }),
      delete: vi.fn().mockResolvedValue({
        id: "1",
        email: "test@mail.com",
        password: "hashed",
      }),
    };
    const refreshTokenService = new RefreshTokenService(
      refreshRepo,
      hashService,
    );
    const useCase = new LoginUserUseCase(
      repo as any,
      hashService as any,
      tokenService as any,
      refreshTokenService as any,
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
      hash: vi.fn().mockResolvedValue("hashed"),
    };

    const tokenService = {
      signAccessToken: vi.fn().mockReturnValue("token"),
      signRefreshToken: vi.fn().mockReturnValue("refreshToken"),
    };

    const refreshRepo = {
      create: vi.fn().mockResolvedValue({
        id: "1",
        email: "test@mail.com",
        password: "hashed",
      }),
      findByUserId: vi.fn().mockResolvedValue({
        id: "1",
        email: "test@mail.com",
        password: "hashed",
      }),
      deleteByUserId: vi.fn().mockResolvedValue({
        id: "1",
        email: "test@mail.com",
        password: "hashed",
      }),
      delete: vi.fn().mockResolvedValue({
        id: "1",
        email: "test@mail.com",
        password: "hashed",
      }),
    };
    const refreshTokenService = new RefreshTokenService(
      refreshRepo,
      hashService,
    );
    const useCase = new LoginUserUseCase(
      repo as any,
      hashService as any,
      tokenService as any,
      refreshTokenService as any,
    );

    await useCase.execute({
      email: "test@mail.com",
      password: "Password123!",
    });

    expect(tokenService.signAccessToken).toHaveBeenCalledWith("1" );
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
      hash: vi.fn().mockResolvedValue("hashed"),
    };

    const tokenService = {
      signAccessToken: vi.fn().mockReturnValue("token"),
      signRefreshToken: vi.fn().mockReturnValue("refreshToken"),
    };

    const refreshRepo = {
      create: vi.fn().mockResolvedValue({
        id: "1",
        email: "test@mail.com",
        password: "hashed",
      }),
      findByUserId: vi.fn().mockResolvedValue({
        id: "1",
        email: "test@mail.com",
        password: "hashed",
      }),
      deleteByUserId: vi.fn().mockResolvedValue({
        id: "1",
        email: "test@mail.com",
        password: "hashed",
      }),
      delete: vi.fn().mockResolvedValue({
        id: "1",
        email: "test@mail.com",
        password: "hashed",
      }),
    };
    const refreshTokenService = new RefreshTokenService(
      refreshRepo,
      hashService,
    );
    const useCase = new LoginUserUseCase(
      repo as any,
      hashService as any,
      tokenService as any,
      refreshTokenService as any,
    );

    await useCase.execute({
      email: "TEST@MAIL.COM",
      password: "Password123!",
    });

    expect(repo.findByEmail).toHaveBeenCalledWith("test@mail.com");
  });
});
