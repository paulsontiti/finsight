import { beforeEach, describe, it, expect, vi } from "vitest";
import {TransferUseCase} from "../../src/application/use-cases/transfer.usecase"

let walletRepo: any;
let transactionRepo: any;
let ledgerRepo: any;
let idempotencyService: any;
let prisma: any;

let useCase: TransferUseCase;

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

  idempotencyService = {
    handle: vi.fn()
  };

  prisma = {
    $transaction: vi.fn((cb: any) => cb({}))
  };

  useCase = new TransferUseCase(
    walletRepo,
    transactionRepo,
    ledgerRepo,
    idempotencyService,
    prisma
  );
});

const validInput = {
  walletId: "user_1",
  receiverWalletId: "user_2",
  amount: 500,
  reference: "ref_123",
  idempotencyKey: "idem_123"
};

describe("Transfer Usecase",()=>{

    it("should transfer funds successfully", async () => {
  idempotencyService.handle.mockImplementation(async ({ handler }: any) => handler());

  walletRepo.findByUserId
    .mockResolvedValueOnce({ id: "w1", balance: 1000 }) // sender
    .mockResolvedValueOnce({ id: "w2", balance: 500 });  // receiver

  transactionRepo.create.mockResolvedValue({ id: "tx_1" });

  walletRepo.updateBalance
    .mockResolvedValueOnce({ balance: 500 })  // sender
    .mockResolvedValueOnce({ balance: 1000 }); // receiver

  const result = await useCase.execute(validInput);

  expect(result.senderBalance).toBe(500);
  expect(result.receiverBalance).toBe(1000);
});

it("should create transfer transaction", async () => {
  idempotencyService.handle.mockImplementation(async ({ handler }: any) => handler());

  walletRepo.findByUserId
    .mockResolvedValueOnce({ id: "w1", balance: 1000 })
    .mockResolvedValueOnce({ id: "w2", balance: 500 });

  transactionRepo.create.mockResolvedValue({ id: "tx_1" });

  walletRepo.updateBalance.mockResolvedValue({ balance: 500 });

  await useCase.execute(validInput);

  expect(transactionRepo.create).toHaveBeenCalledWith(
    expect.objectContaining({
      walletId: "user_1",
      type: "TRANSFER",
      amount: 500
    })
  );
});

it("should create debit and credit ledger entries", async () => {
  idempotencyService.handle.mockImplementation(async ({ handler }: any) => handler());

  walletRepo.findByUserId
    .mockResolvedValueOnce({ id: "w1", balance: 1000 })
    .mockResolvedValueOnce({ id: "w2", balance: 500 });

  transactionRepo.create.mockResolvedValue({ id: "tx_1" });

  walletRepo.updateBalance.mockResolvedValue({ balance: 500 });

  await useCase.execute(validInput);

  const entries = ledgerRepo.createMany.mock.calls[0][0];

  expect(entries).toHaveLength(2);
  expect(entries.some((e: any) => e.type === "DEBIT")).toBe(true);
  expect(entries.some((e: any) => e.type === "CREDIT")).toBe(true);
});

it("should reject invalid amount", async () => {
    idempotencyService.handle.mockImplementation(async ({ handler }: any) => handler());

  walletRepo.findByUserId
    .mockResolvedValueOnce({ id: "w1", balance: 1000 }) // sender
    .mockResolvedValueOnce({ id: "w2", balance: 500 });  // receiver

  transactionRepo.create.mockResolvedValue({ id: "tx_1" });

  walletRepo.updateBalance
    .mockResolvedValueOnce({ balance: 500 })  // sender
    .mockResolvedValueOnce({ balance: 1000 }); // receiver
  
  await expect(
    useCase.execute({ ...validInput,amount:0})
  ).rejects.toThrow();
});

it("should reject transfer to self", async () => {
     idempotencyService.handle.mockImplementation(async ({ handler }: any) => handler());

  walletRepo.findByUserId
    .mockResolvedValueOnce({ id: "w1", balance: 1000 }) // sender
    .mockResolvedValueOnce({ id: "w2", balance: 500 });  // receiver

  transactionRepo.create.mockResolvedValue({ id: "tx_1" });

  walletRepo.updateBalance
    .mockResolvedValueOnce({ balance: 500 })  // sender
    .mockResolvedValueOnce({ balance: 1000 }); // receiver
  await expect(
    useCase.execute({
      ...validInput,
      walletId: "user_1",
      receiverWalletId: "user_1"
    })
  ).rejects.toThrow("Cannot transfer to self");
});

it("should throw if sender wallet not found", async () => {
  walletRepo.findByUserId
    .mockResolvedValueOnce(null)
    .mockResolvedValueOnce({ id: "w2", balance: 500 });
     idempotencyService.handle.mockImplementation(async ({ handler }: any) => handler());

  

  transactionRepo.create.mockResolvedValue({ id: "tx_1" });

  walletRepo.updateBalance
    .mockResolvedValueOnce({ balance: 500 })  // sender
    .mockResolvedValueOnce({ balance: 1000 }); // receiver

  await expect(useCase.execute(validInput)).rejects.toThrow("Wallet not found");
});

it("should throw if receiver wallet not found", async () => {
  walletRepo.findByUserId
    .mockResolvedValueOnce({ id: "w1", balance: 1000 })
    .mockResolvedValueOnce(null);
     idempotencyService.handle.mockImplementation(async ({ handler }: any) => handler());


  transactionRepo.create.mockResolvedValue({ id: "tx_1" });

  walletRepo.updateBalance
    .mockResolvedValueOnce({ balance: 500 })  // sender
    .mockResolvedValueOnce({ balance: 1000 }); // receiver

  await expect(useCase.execute(validInput)).rejects.toThrow("Wallet not found");
});

it("should reject insufficient balance", async () => {
  walletRepo.findByUserId
    .mockResolvedValueOnce({ id: "w1", balance: 100 }) // sender
    .mockResolvedValueOnce({ id: "w2", balance: 500 });
     idempotencyService.handle.mockImplementation(async ({ handler }: any) => handler());



  transactionRepo.create.mockResolvedValue({ id: "tx_1" });

  walletRepo.updateBalance
    .mockResolvedValueOnce({ balance: 500 })  // sender
    .mockResolvedValueOnce({ balance: 1000 }); // receiver

  await expect(useCase.execute(validInput)).rejects.toThrow("Insufficient balance");
});

it("should return cached transfer result", async () => {
  idempotencyService.handle.mockResolvedValue({
    senderBalance: 500,
    receiverBalance: 1000
  });


  walletRepo.findByUserId
    .mockResolvedValueOnce({ id: "w1", balance: 1000 }) // sender
    .mockResolvedValueOnce({ id: "w2", balance: 500 });  // receiver

  transactionRepo.create.mockResolvedValue({ id: "tx_1" });

  walletRepo.updateBalance
    .mockResolvedValueOnce({ balance: 500 })  // sender
    .mockResolvedValueOnce({ balance: 1000 }); // receiver

  const result = await useCase.execute(validInput);

  expect(result.senderBalance).toBe(500);
});

it("should skip execution if cached", async () => {
  idempotencyService.handle.mockResolvedValue({ ok: true });


  walletRepo.findByUserId
    .mockResolvedValueOnce({ id: "w1", balance: 1000 }) // sender
    .mockResolvedValueOnce({ id: "w2", balance: 500 });  // receiver

  transactionRepo.create.mockResolvedValue({ id: "tx_1" });

  walletRepo.updateBalance
    .mockResolvedValueOnce({ balance: 500 })  // sender
    .mockResolvedValueOnce({ balance: 1000 }); // receiver

  await useCase.execute(validInput);

  expect(walletRepo.findByUserId).not.toHaveBeenCalled();
});

it("should ensure debit equals credit", async () => {
  idempotencyService.handle.mockImplementation(async ({ handler }: any) => handler());

  walletRepo.findByUserId
    .mockResolvedValueOnce({ id: "w1", balance: 1000 })
    .mockResolvedValueOnce({ id: "w2", balance: 500 });

  transactionRepo.create.mockResolvedValue({ id: "tx_1" });

  walletRepo.updateBalance.mockResolvedValue({ balance: 500 });

  await useCase.execute(validInput);

  const entries = ledgerRepo.createMany.mock.calls[0][0];

  const debit = entries.find((e: any) => e.type === "DEBIT").amount;
  const credit = entries.find((e: any) => e.type === "CREDIT").amount;

  expect(debit).toBe(credit);
});

it("should rollback if ledger fails", async () => {
  idempotencyService.handle.mockImplementation(async ({ handler }: any) => handler());

  walletRepo.findByUserId
    .mockResolvedValueOnce({ id: "w1", balance: 1000 })
    .mockResolvedValueOnce({ id: "w2", balance: 500 });

  transactionRepo.create.mockResolvedValue({ id: "tx_1" });

  ledgerRepo.createMany.mockRejectedValue(new Error("ledger error"));

  await expect(useCase.execute(validInput)).rejects.toThrow();

  expect(walletRepo.updateBalance).not.toHaveBeenCalled();
});

it("should handle concurrent transfer safely", async () => {
  idempotencyService.handle
    .mockImplementationOnce(async ({ handler }: any) => handler())
    .mockImplementationOnce(async () => ({ senderBalance: 500 }));
    

  walletRepo.findByUserId
    .mockResolvedValueOnce({ id: "w1", balance: 1000 }) // sender
    .mockResolvedValueOnce({ id: "w2", balance: 500 });  // receiver

  transactionRepo.create.mockResolvedValue({ id: "tx_1" });

  walletRepo.updateBalance
    .mockResolvedValueOnce({ balance: 500 })  // sender
    .mockResolvedValueOnce({ balance: 1000 }); // receiver

  const results = await Promise.all([
    useCase.execute(validInput),
    useCase.execute(validInput)
  ]);

  expect(results.length).toBe(2);
});

})