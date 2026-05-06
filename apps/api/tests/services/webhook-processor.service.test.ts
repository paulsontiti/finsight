import { describe, it, expect, beforeEach, vi } from "vitest";
import {WebhookProcessor} from "../../src/services/webhook-processor.service"

let webhookRepo: any;
let paymentUseCase: any;
let processor: WebhookProcessor;

beforeEach(() => {
  webhookRepo = {
    findPending: vi.fn(),
    markProcessed: vi.fn(),
    markFailed: vi.fn()
  };

  paymentUseCase = {
    execute: vi.fn()
  };

  processor = new WebhookProcessor(webhookRepo, paymentUseCase);
});

describe("processBatch - success", () => {
  it("should process and mark event as processed", async () => {
    webhookRepo.findPending.mockResolvedValue([
      {
        id: "1",
        eventType: "charge.success",
        payload: { data: { reference: "ref_1" } }
      }
    ]);

    paymentUseCase.execute.mockResolvedValue(true);

    await processor.processBatch();

    expect(paymentUseCase.execute).toHaveBeenCalled();
    expect(webhookRepo.markProcessed).toHaveBeenCalledWith("1");
  });
});

describe("processBatch - failure", () => {
  it("should mark event as failed when processing fails", async () => {
    webhookRepo.findPending.mockResolvedValue([
      {
        id: "1",
        eventType: "charge.success",
        payload: { data: {} }
      }
    ]);

    paymentUseCase.execute.mockRejectedValue(new Error());

    await processor.processBatch();

    expect(webhookRepo.markFailed).toHaveBeenCalledWith("1");
  });
});

describe("partial failure handling", () => {
  it("should continue processing other events if one fails", async () => {
    webhookRepo.findPending.mockResolvedValue([
      { id: "1", eventType: "charge.success", payload: { data: {} } },
      { id: "2", eventType: "charge.success", payload: { data: {} } }
    ]);

    paymentUseCase.execute
      .mockRejectedValueOnce(new Error())
      .mockResolvedValueOnce(true);

    await processor.processBatch();

    expect(webhookRepo.markFailed).toHaveBeenCalledWith("1");
    expect(webhookRepo.markProcessed).toHaveBeenCalledWith("2");
  });
});

describe("unknown events", () => {
  it("should ignore non charge.success events", async () => {
    webhookRepo.findPending.mockResolvedValue([
      { id: "1", eventType: "transfer.failed", payload: {} }
    ]);

    await processor.processBatch();

    expect(paymentUseCase.execute).not.toHaveBeenCalled();
    expect(webhookRepo.markProcessed).toHaveBeenCalledWith("1");
  });
});

describe("idempotency", () => {
  it("should rely on idempotency inside use case", async () => {
    webhookRepo.findPending.mockResolvedValue([
      {
        id: "1",
        eventType: "charge.success",
        payload: { data: { reference: "ref_123" } }
      }
    ]);

    paymentUseCase.execute.mockResolvedValue({
      balance: 1000
    });

    await processor.processBatch();
    await processor.processBatch(); // simulate retry

    expect(paymentUseCase.execute).toHaveBeenCalledTimes(2);
    // BUT funding should still happen once (handled in use case)
  });
});

describe("duplicate safety", () => {
  it("should not process when no pending events exist", async () => {
    webhookRepo.findPending.mockResolvedValue([]);

    await processor.processBatch();

    expect(paymentUseCase.execute).not.toHaveBeenCalled();
  });
});

describe("concurrency", () => {
  it("should handle concurrent processing without crashing", async () => {
    webhookRepo.findPending.mockResolvedValue([
      {
        id: "1",
        eventType: "charge.success",
        payload: { data: { reference: "ref_1" } }
      }
    ]);

    paymentUseCase.execute.mockResolvedValue(true);

    await Promise.all([
      processor.processBatch(),
      processor.processBatch()
    ]);

    expect(paymentUseCase.execute).toHaveBeenCalled();
  });

  it("should tolerate race conditions safely", async () => {
  webhookRepo.findPending.mockResolvedValue([
    {
      id: "1",
      eventType: "charge.success",
      payload: { data: { reference: "ref_1" } }
    }
  ]);

  paymentUseCase.execute.mockResolvedValue(true);

  await Promise.all([
    processor.processBatch(),
    processor.processBatch(),
    processor.processBatch()
  ]);

  expect(webhookRepo.markProcessed).toHaveBeenCalled();
});

it("should handle mixed outcomes under concurrency", async () => {
  webhookRepo.findPending.mockResolvedValue([
    { id: "1", eventType: "charge.success", payload: { data: {} } }
  ]);

  paymentUseCase.execute
    .mockResolvedValueOnce(true)
    .mockRejectedValueOnce(new Error());

  await Promise.all([
    processor.processBatch(),
    processor.processBatch()
  ]);

  expect(webhookRepo.markProcessed).toHaveBeenCalled();
  expect(webhookRepo.markFailed).toHaveBeenCalled();
});

});

