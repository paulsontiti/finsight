import { describe, it, expect, beforeEach, vi } from "vitest";
import { IdempotencyService } from "../../src/services/idempotency.service";
import { hashRequest } from "../../src/services/hash-request.service";

let repo: any;
let service: IdempotencyService;

beforeEach(() => {
  repo = {
    find: vi.fn(),
    create: vi.fn(),
    updateStatus: vi.fn(),
    saveResponse: vi.fn(),
  };

  service = new IdempotencyService(repo);
});

const baseInput = {
  key: "idem_123",
  userId: "user_1",
  payload: { amount: 1000 },
};

describe("Idempontency Service", () => {
  it("should execute handler and return result", async () => {
    repo.find.mockResolvedValue(null);

    const handler = vi.fn().mockResolvedValue({ success: true });

    const result = await service.handle({
      ...baseInput,
      handler,
    });

    expect(result).toEqual({ success: true });
    expect(handler).toHaveBeenCalled();
  });

  it("should create idempotency record", async () => {
    repo.find.mockResolvedValue(null);

    const handler = vi.fn().mockResolvedValue({ ok: true });

    await service.handle({ ...baseInput, handler });

    expect(repo.create).toHaveBeenCalled();
  });

  it("should update status to PROCESSING then COMPLETED", async () => {
    repo.find.mockResolvedValue(null);

    const handler = vi.fn().mockResolvedValue({ ok: true });

    await service.handle({ ...baseInput, handler });

    expect(repo.updateStatus).toHaveBeenCalledWith(
      "idem_123",
      "user_1",
      "PROCESSING",
    );
    expect(repo.updateStatus).toHaveBeenCalledWith(
      "idem_123",
      "user_1",
      "COMPLETED",
    );
  });

  it("should save response after success", async () => {
    repo.find.mockResolvedValue(null);

    const handler = vi.fn().mockResolvedValue({ balance: 1000 });

    await service.handle({ ...baseInput, handler });

    expect(repo.saveResponse).toHaveBeenCalledWith("idem_123", "user_1", {
      balance: 1000,
    });
  });

  it("should return cached response if request already completed", async () => {
    repo.find.mockResolvedValue({
      status: "COMPLETED",
      response: { balance: 500 },
      requestHash: hashRequest(baseInput.payload),
    });

    const handler = vi.fn();

    const result = await service.handle({
      ...baseInput,
      handler,
    });

    expect(result).toEqual({ balance: 500 });
    expect(handler).not.toHaveBeenCalled();
  });

  it("should reject if idempotency key is reused with different payload", async () => {
    repo.find.mockResolvedValue({
      status: "COMPLETED",
      response: {},
      requestHash: "different_hash",
    });

    await expect(
      service.handle({
        ...baseInput,
        payload: { amount: 999 }, // different
        handler: vi.fn(),
      }),
    ).rejects.toThrow("Idempotency key reused with different payload");
  });

  it("should reject if request is already processing", async () => {
    repo.find.mockResolvedValue({
      status: "PROCESSING",
      requestHash: hashRequest(baseInput.payload),
    });

    await expect(
      service.handle({
        ...baseInput,
        handler: vi.fn(),
      }),
    ).rejects.toThrow("Request already in progress");
  });

  it("should mark as FAILED if handler throws", async () => {
    repo.find.mockResolvedValue(null);

    const handler = vi.fn().mockRejectedValue(new Error("fail"));

    await expect(service.handle({ ...baseInput, handler })).rejects.toThrow();

    expect(repo.updateStatus).toHaveBeenCalledWith(
      "idem_123",
      "user_1",
      "FAILED",
    );
  });

  it("should not save response if handler fails", async () => {
    repo.find.mockResolvedValue(null);

    const handler = vi.fn().mockRejectedValue(new Error("fail"));

    await expect(service.handle({ ...baseInput, handler })).rejects.toThrow();

    expect(repo.saveResponse).not.toHaveBeenCalled();
  });

  it("should generate consistent hash for same payload", () => {
    const hash1 = hashRequest({ amount: 1000 });
    const hash2 = hashRequest({ amount: 1000 });

    expect(hash1).toBe(hash2);
  });

  it("should generate different hash for different payloads", () => {
    const hash1 = hashRequest({ amount: 1000 });
    const hash2 = hashRequest({ amount: 2000 });

    expect(hash1).not.toBe(hash2);
  });

  it("should prevent duplicate execution in concurrent calls", async () => {
    repo.find.mockResolvedValueOnce(null).mockResolvedValueOnce({
      status: "PROCESSING",
      requestHash: hashRequest(baseInput.payload),
    });

    const handler = vi.fn().mockResolvedValue({ ok: true });

    const [r1, r2] = await Promise.allSettled([
      service.handle({ ...baseInput, handler }),
      service.handle({ ...baseInput, handler }),
    ]);

    expect(r1.status).toBe("fulfilled");
    expect(r2.status).toBe("rejected");
  });

  it("should throw if idempotency key is missing", async () => {
    await expect(
      service.handle({
        key: "",
        userId: "user_1",
        payload: {},
        handler: vi.fn(),
      }),
    ).rejects.toThrow();
  });

  it("should throw if userId is missing", async () => {
    await expect(
      service.handle({
        key: "key",
        userId: "",
        payload: {},
        handler: vi.fn(),
      }),
    ).rejects.toThrow();
  });
});
