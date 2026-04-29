import { beforeEach, describe, expect, it, vi } from "vitest";
import { FundWalletUseCase } from "../../src/application/use-cases/fund-wallet.usercase";

let walletRepo: any;
let transactionRepo: any;
let ledgerRepo: any;
let idempotencyService: any;
let prisma: any;

let useCase: FundWalletUseCase;

beforeEach(() => {
  walletRepo = {
    findByUserId: vi.fn(),
    updateBalance: vi.fn()
  };

  transactionRepo = {
    create: vi.fn(),
    updateStatus: vi.fn()
  };

  ledgerRepo = {
    createMany: vi.fn()
  };

  // 🔥 NEW: mock idempotency service
  idempotencyService = {
    handle: vi.fn()
  };

  prisma = {
    $transaction: vi.fn((cb: any) => cb({}))
  };

  useCase = new FundWalletUseCase(
    walletRepo,
    transactionRepo,
    ledgerRepo,
    idempotencyService,
    prisma
  );
});

const validInput = {
  userId: "user_1",
  amount: 1000,
  reference: "ref_123",
  idempotencyKey: "idem_123",requestHash:"123E"
};

describe("Fund Wallet Usecase", () => {

  // 🔥 CORE MOCK BEHAVIOR
  const setupIdempotencyPassThrough = () => {
    idempotencyService.handle.mockImplementation(
      async ({ handler }: any) => handler()
    );
  };

  // =========================
  // 🟢 SUCCESS FLOW
  // =========================

  it("should fund wallet successfully", async () => {
    setupIdempotencyPassThrough();

    walletRepo.findByUserId.mockResolvedValue({ id: "wallet_1", balance: 0 });
    transactionRepo.create.mockResolvedValue({ id: "tx_1" });
    walletRepo.updateBalance.mockResolvedValue({ balance: 1000 });

    const result = await useCase.execute(validInput);

    expect(result.balance).toBe(1000);
  });

  it("should call idempotency handler", async () => {
    setupIdempotencyPassThrough();

    walletRepo.findByUserId.mockResolvedValue({ id: "wallet_1", balance: 0 });
    transactionRepo.create.mockResolvedValue({ id: "tx_1" });
    walletRepo.updateBalance.mockResolvedValue({ balance: 1000 });

    await useCase.execute(validInput);

    expect(idempotencyService.handle).toHaveBeenCalled();
  });

  it("should create transaction", async () => {
    setupIdempotencyPassThrough();

    walletRepo.findByUserId.mockResolvedValue({ id: "wallet_1", balance: 0 });
    transactionRepo.create.mockResolvedValue({ id: "tx_1" });
    walletRepo.updateBalance.mockResolvedValue({ balance: 1000 });

    await useCase.execute(validInput);

    expect(transactionRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user_1",
        amount: 1000
      })
    );
  });

  it("should create debit and credit entries", async () => {
    setupIdempotencyPassThrough();

    walletRepo.findByUserId.mockResolvedValue({ id: "wallet_1", balance: 0 });
    transactionRepo.create.mockResolvedValue({ id: "tx_1" });
    walletRepo.updateBalance.mockResolvedValue({ balance: 1000 });

    await useCase.execute(validInput);

    const entries = ledgerRepo.createMany.mock.calls[0][0];

    expect(entries).toHaveLength(2);
    expect(entries.some((e: any) => e.type === "DEBIT")).toBe(true);
    expect(entries.some((e: any) => e.type === "CREDIT")).toBe(true);
  });

  it("should ensure debit equals credit", async () => {
    setupIdempotencyPassThrough();

    walletRepo.findByUserId.mockResolvedValue({ id: "wallet_1", balance: 0 });
    transactionRepo.create.mockResolvedValue({ id: "tx_1" });
    walletRepo.updateBalance.mockResolvedValue({ balance: 1000 });

    await useCase.execute(validInput);

    const entries = ledgerRepo.createMany.mock.calls[0][0];

    const debit = entries.find((e: any) => e.type === "DEBIT").amount;
    const credit = entries.find((e: any) => e.type === "CREDIT").amount;

    expect(debit).toBe(credit);
  });

  // =========================
  // 🔴 VALIDATION
  // =========================

  it("should reject invalid amount", async () => {
    setupIdempotencyPassThrough();

    await expect(
      useCase.execute({ ...validInput, amount: 0 })
    ).rejects.toThrow();
  });

  it("should throw if wallet not found", async () => {
    setupIdempotencyPassThrough();

    walletRepo.findByUserId.mockResolvedValue(null);

    await expect(useCase.execute(validInput)).rejects.toThrow("Wallet not found");
  });

  // =========================
  // 🔁 IDEMPOTENCY BEHAVIOR
  // =========================

  it("should return cached result when idempotency service returns cached response", async () => {
    idempotencyService.handle.mockResolvedValue({ balance: 500 });

    const result = await useCase.execute(validInput);

    expect(result.balance).toBe(500);
    expect(transactionRepo.create).not.toHaveBeenCalled();
  });

  // =========================
  // 💥 FAILURE
  // =========================

  it("should not update balance if ledger fails", async () => {
    setupIdempotencyPassThrough();

    walletRepo.findByUserId.mockResolvedValue({ id: "wallet_1", balance: 0 });
    transactionRepo.create.mockResolvedValue({ id: "tx_1" });

    ledgerRepo.createMany.mockRejectedValue(new Error("fail"));

    await expect(useCase.execute(validInput)).rejects.toThrow();

    expect(walletRepo.updateBalance).not.toHaveBeenCalled();
  });

});