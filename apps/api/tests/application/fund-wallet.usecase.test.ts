import { beforeEach, describe, expect, it, vi } from "vitest";
import { FundWalletUseCase } from "../../src/application/use-cases/fund-wallet.usercase";

let walletRepo: any;
let transactionRepo: any;
let ledgerRepo: any;
let idempotencyRepo: any;
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

  idempotencyRepo = {
    find: vi.fn(),
    save: vi.fn()
  };

  prisma = {
    $transaction: vi.fn((cb: any) => cb({}))
  };

  useCase = new FundWalletUseCase(
    walletRepo,
    transactionRepo,
    ledgerRepo,
    idempotencyRepo,
    prisma,
  );
});

const validInput = {
  userId: "user_1",
  amount: 1000,
  reference: "ref_123",
  idempotencyKey: "idem_123"
};

describe("Fund Wallet Usecase",()=>{

it("should fund wallet successfully", async () => {
  walletRepo.findByUserId.mockResolvedValue({ id: "wallet_1", balance: 0 });

  transactionRepo.create.mockResolvedValue({ id: "tx_1" });

  walletRepo.updateBalance.mockResolvedValue({ balance: 1000 });

  const result = await useCase.execute(validInput);

  expect(result.balance).toBe(1000);
});

it("should create transaction", async () => {
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
  walletRepo.findByUserId.mockResolvedValue({ id: "wallet_1", balance: 0 });
  transactionRepo.create.mockResolvedValue({ id: "tx_1" });
  walletRepo.updateBalance.mockResolvedValue({ balance: 1000 });

  await useCase.execute(validInput);

  const entries = ledgerRepo.createMany.mock.calls[0][0];

  expect(entries).toHaveLength(2);
  expect(entries.some((e: any) => e.type === "DEBIT")).toBe(true);
  expect(entries.some((e: any) => e.type === "CREDIT")).toBe(true);
});

it("should reject invalid amount", async () => {
  await expect(
    useCase.execute({ ...validInput, amount: 0 })
  ).rejects.toThrow();
});

it("should throw if wallet not found", async () => {
  walletRepo.findByUserId.mockResolvedValue(null);

  await expect(useCase.execute(validInput)).rejects.toThrow("Wallet not found");
});

it("should return cached result for duplicate request", async () => {
  idempotencyRepo.find.mockResolvedValue({ response: { balance: 500 } });

  const result = await useCase.execute(validInput);

  expect(result.balance).toBe(500);
  expect(transactionRepo.create).not.toHaveBeenCalled();
});

it("should save idempotency result", async () => {
  walletRepo.findByUserId.mockResolvedValue({ id: "wallet_1", balance: 0 });
  transactionRepo.create.mockResolvedValue({ id: "tx_1" });
  walletRepo.updateBalance.mockResolvedValue({ balance: 1000 });

  await useCase.execute(validInput);

  expect(idempotencyRepo.save).toHaveBeenCalledWith(
    validInput.idempotencyKey,
    { balance: 1000 }
  );
});

it("should ensure debit equals credit", async () => {
  walletRepo.findByUserId.mockResolvedValue({ id: "wallet_1", balance: 0 });
  transactionRepo.create.mockResolvedValue({ id: "tx_1" });
  walletRepo.updateBalance.mockResolvedValue({ balance: 1000 });

  await useCase.execute(validInput);

  const entries = ledgerRepo.createMany.mock.calls[0][0];

  const debit = entries.find((e: any) => e.type === "DEBIT").amount;
  const credit = entries.find((e: any) => e.type === "CREDIT").amount;

  expect(debit).toBe(credit);
});

it("should not update balance if ledger fails", async () => {
  walletRepo.findByUserId.mockResolvedValue({ id: "wallet_1", balance: 0 });
  transactionRepo.create.mockResolvedValue({ id: "tx_1" });

  ledgerRepo.createMany.mockRejectedValue(new Error("fail"));

  await expect(useCase.execute(validInput)).rejects.toThrow();

  expect(walletRepo.updateBalance).not.toHaveBeenCalled();
});

})