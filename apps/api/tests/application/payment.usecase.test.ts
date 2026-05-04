import { beforeEach, describe, expect, it, vi } from "vitest";
import { PaymentUseCase } from "../../src/application/use-cases/payment.usecase";

let walletRepo: any;
let transactionRepo: any;
let ledgerRepo: any;
let idempotencyService: any;
let prisma: any;
let useCase: any;

beforeEach(() => {
  walletRepo = {
    findByUserId: vi.fn(),
    updateBalance: vi.fn(),
  };

  transactionRepo = {
    create: vi.fn(),
    updateStatus: vi.fn(),
  };

  ledgerRepo = {
    createMany: vi.fn(),
  };

  idempotencyService = {
    handle: vi.fn(),
  };

  prisma = {
    $transaction: vi.fn((cb: any) => cb()),
  };
  useCase = new PaymentUseCase(
    walletRepo,
    transactionRepo,
    ledgerRepo,
    idempotencyService,
    prisma,
  );
});

describe("Payment Usecase", () => {
  it("should fund wallet on successful payment", async () => {
    idempotencyService.handle.mockImplementation(async ({ handler }: any) =>
      handler(),
    );

    walletRepo.findByUserId.mockResolvedValue({ id: "w1", balance: 0 });
    transactionRepo.create.mockResolvedValue({ id: "tx_1" });
    walletRepo.updateBalance.mockResolvedValue({ balance: 1000 });

    const result = await useCase.execute({
      reference: "ref_123",
      amount: 100000,
      metadata: { userId: "user_1", walletId: "wallet_123" },
    });

    expect(result.balance).toBe(1000);
  });

  it("should not double fund wallet for same reference", async () => {
  idempotencyService.handle.mockResolvedValue({ balance: 1000 });

  const result = await useCase.execute({
    reference: "ref_123",
    amount: 100000,
    metadata: { userId: "user_1" }
  });

  expect(walletRepo.updateBalance).not.toHaveBeenCalled();
  expect(result.balance).toBe(1000);
});

it("should create debit and credit entries", async () => {
  idempotencyService.handle.mockImplementation(async ({ handler }: any) => handler());

  walletRepo.findByUserId.mockResolvedValue({ id: "w1", balance: 0 });
  transactionRepo.create.mockResolvedValue({ id: "tx_1" });
  walletRepo.updateBalance.mockResolvedValue({ balance: 1000 });

  await useCase.execute({
    reference: "ref_123",
    amount: 100000,
    metadata: { userId: "user_1" }
  });

  const entries = ledgerRepo.createMany.mock.calls[0][0];

  expect(entries.length).toBe(2);
});

it("should rollback if ledger fails", async () => {
  idempotencyService.handle.mockImplementation(async ({ handler }: any) => handler());

  walletRepo.findByUserId.mockResolvedValue({ id: "w1", balance: 0 });
  transactionRepo.create.mockResolvedValue({ id: "tx_1" });

  ledgerRepo.createMany.mockRejectedValue(new Error("fail"));

  await expect(
    useCase.execute({
      reference: "ref_123",
      amount: 100000,
      metadata: { userId: "user_1" }
    })
  ).rejects.toThrow();

  expect(walletRepo.updateBalance).not.toHaveBeenCalled();
});
});
