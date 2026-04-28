import { describe, expect, it, vi } from "vitest";
import { CreateWalletUseCase } from "../../src/application/use-cases/create-wallet.usecase";

describe("Create Wallet Usecase", () => {
  it("should create wallet for user", async () => {
    const walletRepo = {
      findByUserId: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockImplementation((w) => Promise.resolve(w)),
    };

    const useCase = new CreateWalletUseCase(walletRepo as any);

    const result = await useCase.execute({
      userId: "user_1",
      currency: "NGN",
    });

    expect(result.userId).toBe("user_1");
    expect(walletRepo.create).toHaveBeenCalled();
  });

  it("should create wallet with ACTIVE status", async () => {
    const walletRepo = {
      findByUserId: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockImplementation((w) => Promise.resolve(w)),
    };

    const useCase = new CreateWalletUseCase(walletRepo as any);

    const result = await useCase.execute({
      userId: "user_1",
      currency: "NGN",
    });

    expect(result.status).toBe("ACTIVE");
  });

  it("should not allow multiple wallets per user", async () => {
    const walletRepo = {
      findByUserId: vi.fn().mockResolvedValue({ id: "existing" }),
      create: vi.fn(),
    };

    const useCase = new CreateWalletUseCase(walletRepo as any);

    await expect(
      useCase.execute({
        userId: "user_1",
        currency: "NGN",
      }),
    ).rejects.toThrow("User already has a wallet");
  });

  it("should check existing wallet before creation", async () => {
    const walletRepo = {
      findByUserId: vi.fn().mockResolvedValue(null),
      create: vi.fn(),
    };

    const useCase = new CreateWalletUseCase(walletRepo as any);

    await useCase.execute({
      userId: "user_1",
      currency: "NGN",
    });

    expect(walletRepo.findByUserId).toHaveBeenCalledWith("user_1");
  });

  it("should not create wallet if one already exists", async () => {
    const walletRepo = {
      findByUserId: vi.fn().mockResolvedValue({ id: "wallet_1" }),
      create: vi.fn(),
    };

    const useCase = new CreateWalletUseCase(walletRepo as any);

    await expect(
      useCase.execute({
        userId: "user_1",
        currency: "NGN",
      }),
    ).rejects.toThrow();

    expect(walletRepo.create).not.toHaveBeenCalled();
  });
});
