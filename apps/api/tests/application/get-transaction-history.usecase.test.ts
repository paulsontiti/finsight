import { beforeEach, describe, it, expect, vi } from "vitest";
import { GetTransactionHistoryUseCase } from "../../src/application/use-cases/get-transaction-history.usecase";

let transactionRepo: any;
let useCase: GetTransactionHistoryUseCase;

beforeEach(() => {
  transactionRepo = {
    findMany: vi.fn()
  };

  useCase = new GetTransactionHistoryUseCase(transactionRepo);
});

const baseInput = {
  userId: "user_1",
  page: 1,
  limit: 10
};

describe("Get Transaction History",()=>{

    it("should return transaction history", async () => {
  transactionRepo.findMany.mockResolvedValue({
    data: [{ id: "tx_1" }],
    meta: { total: 1, page: 1, limit: 10, totalPages: 1 }
  });

  const result = await useCase.execute(baseInput);

  expect(result.data.length).toBe(1);
});

it("should call repo with correct parameters", async () => {
  transactionRepo.findMany.mockResolvedValue({ data: [], meta: {} });

  await useCase.execute(baseInput);

  expect(transactionRepo.findMany).toHaveBeenCalledWith(
    expect.objectContaining({
      userId: "user_1",
      page: 1,
      limit: 10
    })
  );
});

it("should use default pagination", async () => {
  transactionRepo.findMany.mockResolvedValue({ data: [], meta: {} });

  await useCase.execute({ userId: "user_1" });

  expect(transactionRepo.findMany).toHaveBeenCalledWith(
    expect.objectContaining({
      page: 1,
      limit: 10
    })
  );
});

it("should respect custom page and limit", async () => {
  transactionRepo.findMany.mockResolvedValue({ data: [], meta: {} });

  await useCase.execute({ userId: "user_1", page: 2, limit: 20 });

  expect(transactionRepo.findMany).toHaveBeenCalledWith(
    expect.objectContaining({
      page: 2,
      limit: 20
    })
  );
});

it("should filter by transaction type", async () => {
  transactionRepo.findMany.mockResolvedValue({ data: [], meta: {} });

  await useCase.execute({ ...baseInput, type: "TRANSFER" });

  expect(transactionRepo.findMany).toHaveBeenCalledWith(
    expect.objectContaining({ type: "TRANSFER" })
  );
});

it("should filter by status", async () => {
  transactionRepo.findMany.mockResolvedValue({ data: [], meta: {} });

  await useCase.execute({ ...baseInput, status: "SUCCESS" });

  expect(transactionRepo.findMany).toHaveBeenCalledWith(
    expect.objectContaining({ status: "SUCCESS" })
  );
});

it("should filter by date range", async () => {
  const fromDate = new Date("2024-01-01");
  const toDate = new Date("2024-12-31");

  transactionRepo.findMany.mockResolvedValue({ data: [], meta: {} });

  await useCase.execute({ ...baseInput, fromDate, toDate });

  expect(transactionRepo.findMany).toHaveBeenCalledWith(
    expect.objectContaining({ fromDate, toDate })
  );
});

it("should always filter by userId", async () => {
  transactionRepo.findMany.mockResolvedValue({ data: [], meta: {} });

  await useCase.execute(baseInput);

  expect(transactionRepo.findMany).toHaveBeenCalledWith(
    expect.objectContaining({
      userId: "user_1"
    })
  );
});

it("should throw if repository fails", async () => {
  transactionRepo.findMany.mockRejectedValue(new Error("DB error"));

  await expect(useCase.execute(baseInput)).rejects.toThrow();
});

it("should return empty data if no transactions", async () => {
  transactionRepo.findMany.mockResolvedValue({
    data: [],
    meta: { total: 0, page: 1, limit: 10, totalPages: 0 }
  });

  const result = await useCase.execute(baseInput);

  expect(result.data).toEqual([]);
});

it("should handle large dataset pagination", async () => {
  transactionRepo.findMany.mockResolvedValue({
    data: Array(10).fill({}),
    meta: { total: 1000, page: 1, limit: 10, totalPages: 100 }
  });

  const result = await useCase.execute(baseInput);

  expect(result.meta.totalPages).toBe(100);
});
})