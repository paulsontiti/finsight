import { describe, it, expect, beforeEach, vi } from "vitest";
import { TransferUseCase } from "../../src/application/use-cases/transfer.usecase";

let walletRepo: any;
let ledgerRepo: any;
let transactionRepo: any;
let idempotencyService: any;
let prisma: any;

let useCase: TransferUseCase;

beforeEach(() => {
  walletRepo = {
    findByUserId: vi.fn(),
    updateBalance: vi.fn(),
    incrementBalance: vi.fn(),
    decrementBalance: vi.fn(),
    getAllWallets: vi.fn(),
    updateSenderReceiverBalance: vi.fn(),
  };

  ledgerRepo = {
    createMany: vi.fn(),
  };

  transactionRepo = {
    create: vi.fn(),
    findByReference: vi.fn(),
    updateStatus: vi.fn(),
  };

  idempotencyService = {
    handle: vi.fn(async ({ handler }: any) => {
      return await handler();
    }),
  };

  prisma = {
    $transaction: vi.fn(async (cb: any) => cb(prisma)),
  };

  useCase = new TransferUseCase(
    walletRepo,
    transactionRepo,
    ledgerRepo,
    idempotencyService,
    prisma,
  );
});

describe("Transfer Atomicity", () => {
  it("should rollback if ledger creation fails", async () => {
    walletRepo.findByUserId
      .mockResolvedValueOnce({
        id: "sender_wallet",
        balance: 5000,
      })
      .mockResolvedValueOnce({
        id: "receiver_wallet",
        balance: 1000,
      });

    transactionRepo.create.mockResolvedValue({
      id: "tx_1",
    });

    ledgerRepo.createMany.mockRejectedValue(new Error("Ledger failure"));

    await expect(
      useCase.execute({
        walletId: "sender_wallet",
        receiverWalletId: "receiver_wallet",
        amount: 1000,
        reference: "ref_123",
        idempotencyKey: "idem_123",
      }),
    ).rejects.toThrow("Ledger failure");

    expect(walletRepo.decrementBalance).not.toHaveBeenCalled();

    expect(walletRepo.incrementBalance).not.toHaveBeenCalled();
  });

  it("should rollback if receiver balance update fails", async () => {
    walletRepo.findByUserId
      .mockResolvedValueOnce({ id: "sender", balance: 5000 })
      .mockResolvedValueOnce({ id: "receiver", balance: 1000 });

    transactionRepo.create.mockResolvedValue({ id: "tx_1" });

    ledgerRepo.createMany.mockResolvedValue(true);

    walletRepo.decrementBalance.mockResolvedValue(true);

    walletRepo.incrementBalance.mockRejectedValue(new Error("DB crash"));

    await expect(
      useCase.execute({
        walletId: "sender_wallet",
        receiverWalletId: "receiver_wallet",
        amount: 1000,
        reference: "ref_123",
        idempotencyKey: "idem_123",
      }),
    ).rejects.toThrow();
  });

  it("should prevent duplicate transfer requests", async () => {
    transactionRepo.findByReference = vi.fn();

    transactionRepo.findByReference.mockResolvedValue({
      id: "existing_tx",
    });

    await expect(
      useCase.execute({
        walletId: "sender_wallet",
        receiverWalletId: "receiver_wallet",
        amount: 1000,
        reference: "ref_123",
        idempotencyKey: "idem_123",
      }),
    ).rejects.toThrow("Duplicate transaction");
  });

  it("should handle concurrent transfers safely", async () => {
    walletRepo.findByUserId.mockResolvedValue({
      id: "wallet_1",
      balance: 100000,
    });

    transactionRepo.create.mockResolvedValue({ id: "tx" });

    ledgerRepo.createMany.mockResolvedValue(true);

    // walletRepo.decrementBalance.mockResolvedValue(true);
    // walletRepo.incrementBalance.mockResolvedValue(true);

    const transfers = Array.from({ length: 50 }, () => {
      walletRepo.updateSenderReceiverBalance.mockResolvedValueOnce({
        senderWallet: { id: "sender", balance: 5000 },
        receiverWallet: { id: "receiver", balance: 10000 },
      });

      useCase.execute({
        walletId: "sender_wallet",
        receiverWalletId: "receiver_wallet",
        amount: 1000,
        reference: "ref_123",
        idempotencyKey: "idem_123",
      });
    });

    await Promise.all(transfers);

    expect(
      new Set(transactionRepo.create.mock.calls.map((c: any) => c[0].reference))
        .size,
    ).toBe(transactionRepo.create.mock.calls.length);
  });

  it("should tolerate duplicate webhook delivery", async () => {
    transactionRepo.findByReference = vi.fn();

    transactionRepo.findByReference
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: "existing" });

    const first = useCase.execute({
      walletId: "sender_wallet",
      receiverWalletId: "receiver_wallet",
      amount: 1000,
      reference: "ref_123",
      idempotencyKey: "idem_123",
    });

    const second = useCase.execute({
      walletId: "sender_wallet",
      receiverWalletId: "receiver_wallet",
      amount: 1000,
      reference: "ref_1234",
      idempotencyKey: "idem_123",
    });

    await Promise.allSettled([first, second]);

    expect(
      new Set(transactionRepo.create.mock.calls.map((c: any) => c[0].reference))
        .size,
    ).toBe(transactionRepo.create.mock.calls.length);
  });

  it("should prevent overspending under concurrency", async () => {
  walletRepo.findByUserId.mockResolvedValue({
    id: "wallet_1",
    balance: 1000
  });

  const transfers = Array.from({ length: 20 }, () =>
   useCase.execute({
      walletId: "sender_wallet",
      receiverWalletId: "receiver_wallet",
      amount: 1000,
      reference: "ref_1234",
      idempotencyKey: "idem_123",
    })
  );

  const results = await Promise.allSettled(transfers);

  const successful = results.filter(
    (r) => r.status === "fulfilled"
  );

  expect(successful.length).toBeLessThanOrEqual(5);
});
});
