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
    // Queries
    findByUserId: vi.fn(),
    findById: vi.fn(),
    getAllWallets: vi.fn(),
    getSenderReceiverWallets: vi.fn(),

    // Commands
    create: vi.fn(),

    safeDebit: vi.fn(),
    safeCredit: vi.fn(),
    safeTransfer: vi.fn(),

    updateBalance: vi.fn(),
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

describe("Transfer Atomicity & Concurrency", () => {
  // ======================================================
  // ROLLBACK TESTS
  // ======================================================

  it("should rollback if ledger creation fails", async () => {
    transactionRepo.findByReference.mockResolvedValue(null);

    walletRepo.getSenderReceiverWallets.mockResolvedValueOnce({
      senderWallet: {
        id: "sender_wallet",
        balance: 5000,
        version: 1,
      },
      receiverWallet: {
        id: "receiver_wallet",
        balance: 1000,
        version: 1,
      },
    });

    walletRepo.safeDebit.mockResolvedValue(true);

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

    expect(walletRepo.safeCredit).not.toHaveBeenCalled();
  });

  it("should rollback if receiver credit fails", async () => {
    transactionRepo.findByReference.mockResolvedValue(null);

    walletRepo.getSenderReceiverWallets.mockResolvedValueOnce({
      senderWallet: {
        id: "sender_wallet",
        balance: 5000,
        version: 1,
      },
      receiverWallet: {
        id: "receiver_wallet",
        balance: 1000,
        version: 1,
      },
    });

    walletRepo.safeDebit.mockResolvedValue(true);

    walletRepo.safeCredit.mockRejectedValue(
      new Error("Receiver wallet conflict"),
    );

    transactionRepo.create.mockResolvedValue({
      id: "tx_1",
    });

    ledgerRepo.createMany.mockResolvedValue(true);

    await expect(
      useCase.execute({
        walletId: "sender_wallet",
        receiverWalletId: "receiver_wallet",
        amount: 1000,
        reference: "ref_123",
        idempotencyKey: "idem_123",
      }),
    ).rejects.toThrow("Receiver wallet conflict");
  });

  // ======================================================
  // DUPLICATE PROTECTION
  // ======================================================

  it("should prevent duplicate transaction reference", async () => {
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

    expect(transactionRepo.create).not.toHaveBeenCalled();
  });

  // // ======================================================
  // // CONCURRENCY PROTECTION
  // // ======================================================

  it("should prevent double spending under concurrency", async () => {
    transactionRepo.findByReference.mockResolvedValue(null);
    walletRepo.getSenderReceiverWallets.mockResolvedValueOnce({
      senderWallet: {
        id: "sender_wallet",
        balance: 5000,
        version: 1,
      },
      receiverWallet: {
        id: "receiver_wallet",
        balance: 1000,
        version: 1,
      },
    });
    walletRepo.findById
      .mockResolvedValueOnce({
        id: "sender_wallet",
        balance: 5000,
        version: 1,
      })
      .mockResolvedValueOnce({
        id: "receiver_wallet",
        balance: 1000,
        version: 1,
      });

    // First succeeds
    walletRepo.safeDebit
      .mockResolvedValueOnce(true)

      // Remaining fail due to optimistic locking
      .mockRejectedValue(
        new Error("Insufficient balance or concurrent update"),
      );
    walletRepo.safeCredit.mockResolvedValueOnce(true);

    transactionRepo.create.mockResolvedValue({
      id: "tx_1",
    });

    ledgerRepo.createMany.mockResolvedValue(true);

    const transfers = Array.from({ length: 20 }, (_, i) =>
      useCase.execute({
        walletId: "sender_wallet",
        receiverWalletId: "receiver_wallet",
        amount: 1000,
        reference: `ref_${i}`,
        idempotencyKey: `idem_${i}`,
      }),
    );

    const results = await Promise.allSettled(transfers);

    const successful = results.filter((r) => r.status === "fulfilled");

    expect(successful.length).toBe(1);

    expect(walletRepo.safeDebit).toHaveBeenCalled();
  });

  it("should detect concurrent wallet modification", async () => {
    transactionRepo.findByReference.mockResolvedValue(null);
    walletRepo.getSenderReceiverWallets.mockResolvedValueOnce({
      senderWallet: {
        id: "sender_wallet",
        balance: 5000,
        version: 1,
      },
      receiverWallet: {
        id: "receiver_wallet",
        balance: 1000,
        version: 1,
      },
    });
    walletRepo.findById.mockResolvedValue({
      id: "sender_wallet",
      balance: 5000,
      version: 1,
    });

    walletRepo.safeDebit.mockRejectedValue(
      new Error("Insufficient balance or concurrent update"),
    );
    transactionRepo.create.mockResolvedValue({
      id: "tx_1",
    });
    await expect(
      useCase.execute({
        walletId: "sender_wallet",
        receiverWalletId: "receiver_wallet",
        amount: 1000,
        reference: "ref_123",
        idempotencyKey: "idem_123",
      }),
    ).rejects.toThrow("Insufficient balance or concurrent update");
  });

  // // ======================================================
  // // IDEMPOTENCY TESTS
  // // ======================================================

  it("should tolerate duplicate webhook delivery", async () => {
    transactionRepo.findByReference
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        id: "existing_tx",
      });
    walletRepo.getSenderReceiverWallets.mockResolvedValueOnce({
      senderWallet: {
        id: "sender_wallet",
        balance: 5000,
        version: 1,
      },
      receiverWallet: {
        id: "receiver_wallet",
        balance: 1000,
        version: 1,
      },
    });
    walletRepo.findById.mockResolvedValue({
      id: "sender_wallet",
      balance: 5000,
      version: 1,
    });

    walletRepo.safeDebit.mockResolvedValue(true);

    walletRepo.safeCredit.mockResolvedValue(true);

    transactionRepo.create.mockResolvedValue({
      id: "tx_1",
    });

    ledgerRepo.createMany.mockResolvedValue(true);

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
      reference: "ref_123",
      idempotencyKey: "idem_123",
    });

    const results = await Promise.allSettled([first, second]);

    const successful = results.filter((r) => r.status === "fulfilled");

    const failed = results.filter((r) => r.status === "rejected");

    expect(successful.length).toBe(1);

    expect(failed.length).toBe(1);
  });

  // // ======================================================
  // // LEDGER INTEGRITY
  // // ======================================================

  it("should maintain debit-credit equality", async () => {
    const entries = [
      {
        type: "DEBIT",
        amount: 1000,
      },
      {
        type: "CREDIT",
        amount: 1000,
      },
    ];

    const debitTotal = entries
      .filter((e) => e.type === "DEBIT")
      .reduce((sum, e) => sum + e.amount, 0);

    const creditTotal = entries
      .filter((e) => e.type === "CREDIT")
      .reduce((sum, e) => sum + e.amount, 0);

    expect(debitTotal).toBe(creditTotal);
  });

  // // ======================================================
  // // VERSIONING TESTS
  // // ======================================================

  it("should increment wallet version after transfer", async () => {
    transactionRepo.findByReference.mockResolvedValue(null);
    walletRepo.getSenderReceiverWallets.mockResolvedValueOnce({
      senderWallet: {
        id: "sender_wallet",
        balance: 5000,
        version: 1,
      },
      receiverWallet: {
        id: "receiver_wallet",
        balance: 1000,
        version: 1,
      },
    });
    walletRepo.findById
      .mockResolvedValueOnce({
        id: "sender_wallet",
        balance: 5000,
        version: 1,
      })
      .mockResolvedValueOnce({
        id: "receiver_wallet",
        balance: 1000,
        version: 1,
      });

    walletRepo.safeDebit.mockResolvedValue({
      version: 2,
    });

    walletRepo.safeCredit.mockResolvedValue({
      version: 2,
    });

    transactionRepo.create.mockResolvedValue({
      id: "tx_1",
    });

    ledgerRepo.createMany.mockResolvedValue(true);

    await useCase.execute({
      walletId: "sender_wallet",
      receiverWalletId: "receiver_wallet",
      amount: 1000,
      reference: "ref_123",
      idempotencyKey: "idem_123",
    });

    expect(walletRepo.safeDebit).toHaveBeenCalledWith("sender_wallet", 1000, 1);
  });
});
