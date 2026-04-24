import { describe, expect, it, vi } from "vitest";
import { RefreshTokenUseCase } from "../../src/application/use-cases/refresh-token.usecase";

describe("Refresh token Usecase", () => {
  it("should generate new access token", async () => {
    const tokenService = {
      verify: vi.fn().mockReturnValue({ userId: "1" }),
      signAccessToken: vi.fn().mockReturnValue("new-access"),
    };

    const refreshService = {
      validate: vi.fn().mockResolvedValue({ id: "rt1" }),
    };

    const useCase = new RefreshTokenUseCase(
      tokenService as any,
      refreshService as any,
    );

    const accessToken = await useCase.execute("refresh-token");

    expect(accessToken).toBe("new-access");
  });

  it("should throw if no refresh token", async () => {
  const useCase = new RefreshTokenUseCase({} as any, {} as any);

  await expect(useCase.execute(""))
    .rejects.toThrow();
});

it("should throw if refresh token invalid", async () => {
  const tokenService = {
    verify: vi.fn().mockReturnValue({ userId: "1" })
  };

  const refreshService = {
    validate: vi.fn().mockResolvedValue(null)
  };

  const useCase = new RefreshTokenUseCase(
    tokenService as any,
    refreshService as any
  );

  await expect(useCase.execute("bad"))
    .rejects.toThrow();
});

it("should verify refresh token", async () => {
  const tokenService = {
    verify: vi.fn().mockReturnValue({ userId: "1" }),
    signAccessToken: vi.fn().mockReturnValue("new")
  };

  const refreshService = {
    validate: vi.fn().mockResolvedValue({ id: "rt1" })
  };

  const useCase = new RefreshTokenUseCase(
    tokenService as any,
    refreshService as any
  );

  await useCase.execute("token");

  expect(tokenService.verify).toHaveBeenCalledWith("token");
});
});
