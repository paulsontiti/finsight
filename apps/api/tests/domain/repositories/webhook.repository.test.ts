import { describe, it, expect, beforeEach, vi } from "vitest";
import { WebhookRepository } from "../../../src/domain/repositories/webhook.repository";

let prisma: any;
let repo: WebhookRepository;

beforeEach(() => {
  prisma = {
    webhookEvent: {
      create: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn()
    }
  };

  repo = new WebhookRepository(prisma);
});

describe("createEvent", () => {
  it("should create a webhook event with PENDING status", async () => {
    prisma.webhookEvent.create.mockResolvedValue({
      id: "event_1",
      status: "PENDING"
    });

    const result = await repo.createEvent({
      provider: "paystack",
      eventType: "charge.success",
      reference: "ref_123",
      payload: { amount: 1000 }
    });

    expect(prisma.webhookEvent.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        provider: "paystack",
        eventType: "charge.success",
        reference: "ref_123",
        payload: { amount: 1000 },
        status: "PENDING"
      })
    });

    expect(result.id).toBe("event_1");
  });

  it("should throw error if duplicate reference is inserted", async () => {
    prisma.webhookEvent.create.mockRejectedValue(
      new Error("Unique constraint failed")
    );

    await expect(
      repo.createEvent({
        provider: "paystack",
        eventType: "charge.success",
        reference: "ref_123",
        payload: {}
      })
    ).rejects.toThrow();
  });

  describe("markProcessed", () => {
  it("should update event status to PROCESSED", async () => {
    prisma.webhookEvent.update.mockResolvedValue({
      id: "event_1",
      status: "PROCESSED"
    });

    await repo.markProcessed("event_1");

    expect(prisma.webhookEvent.update).toHaveBeenCalledWith({
      where: { id: "event_1" },
      data: { status: "PROCESSED" }
    });
  });

  it("should throw if event does not exist", async () => {
    prisma.webhookEvent.update.mockRejectedValue(new Error("Not found"));

    await expect(repo.markProcessed("invalid_id")).rejects.toThrow();
  });
});
});

describe("markFailed", () => {
  it("should set status to FAILED and increment retry count", async () => {
    prisma.webhookEvent.update.mockResolvedValue({
      id: "event_1",
      status: "FAILED",
      retryCount: 1
    });

    await repo.markFailed("event_1");

    expect(prisma.webhookEvent.update).toHaveBeenCalledWith({
      where: { id: "event_1" },
      data: {
        status: "FAILED",
        retryCount: { increment: 1 }
      }
    });
  });

  it("should increment retry count multiple times", async () => {
    await repo.markFailed("event_1");
    await repo.markFailed("event_1");

    expect(prisma.webhookEvent.update).toHaveBeenCalledTimes(2);
  });
});

describe("findPending", () => {
  it("should return pending events up to limit", async () => {
    prisma.webhookEvent.findMany.mockResolvedValue([
      { id: "1", status: "PENDING" },
      { id: "2", status: "PENDING" }
    ]);

    const result = await repo.findPending(2);

    expect(prisma.webhookEvent.findMany).toHaveBeenCalledWith({
      where: { status: "PENDING" },
      take: 2
    });

    expect(result.length).toBe(2);
  });

  it("should return empty array if no pending events", async () => {
    prisma.webhookEvent.findMany.mockResolvedValue([]);

    const result = await repo.findPending(5);

    expect(result).toEqual([]);
  });
});

describe("edge cases", () => {
  it("should handle large payloads", async () => {
    const largePayload = { data: "x".repeat(10000) };

    prisma.webhookEvent.create.mockResolvedValue({ id: "event_large" });

    const result = await repo.createEvent({
      provider: "paystack",
      eventType: "charge.success",
      reference: "ref_large",
      payload: largePayload
    });

    expect(result.id).toBe("event_large");
  });

  it("should handle invalid inputs gracefully", async () => {
    await expect(
      repo.createEvent({
        provider: "",
        eventType: "",
        reference: "",
        payload: null
      })
    ).rejects.toThrow();
  });
});