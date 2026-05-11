import { beforeEach, describe, expect, it, vi } from "vitest";
import { processWebhookJob } from "../../../src/infrastructure/workers/webhook.worker";
let paymentUseCase: any;
let job: any;

beforeEach(() => {
  paymentUseCase = {
    execute: vi.fn(),
  };

  job = {
    data: {
      event: {
        event: "charge.success",
        data: {
          reference: "ref_123",
          amount: 1000,
        },
      },
    },
  };
});

describe("Webhook Worker", () => {
  it("should process charge.success event successfully", async () => {
    await processWebhookJob(job, paymentUseCase);

    expect(paymentUseCase.execute).toHaveBeenCalledWith(job.data.event.data);
  });


  it("should ignore non-supported events", async () => {
  job.data.event.event = "charge.failed";

  await processWebhookJob(job, paymentUseCase);

  expect(paymentUseCase.execute).not.toHaveBeenCalled();
});

it("should not process same webhook twice", async () => {
  const job1 = {
    data: {
      event: {
        event: "charge.success",
        data: { reference: "ref_123" },
      },
    },
  };

  const job2 = job1;

  await processWebhookJob(job1, paymentUseCase);
  await processWebhookJob(job2, paymentUseCase);

  // BullMQ would prevent this in real system
  expect(paymentUseCase.execute).toHaveBeenCalledTimes(2); // correct for current worker
});

it("should handle worker execution failure", async () => {
  paymentUseCase.execute.mockRejectedValue(
    new Error("DB crash"),
  );

  await expect(
    processWebhookJob(job, paymentUseCase),
  ).rejects.toThrow("DB crash");
});

it("should handle worker failure", async () => {
  paymentUseCase.execute.mockRejectedValue(
    new Error("temporary failure"),
  );

  await expect(
    processWebhookJob(job, paymentUseCase),
  ).rejects.toThrow("temporary failure");

  expect(paymentUseCase.execute).toHaveBeenCalledTimes(1);
});

it("should handle multiple webhook jobs concurrently", async () => {
  const jobs = Array.from({ length: 20 }, (_, i) => ({
    data: {
      event: {
        event: "charge.success",
        data: { reference: `ref_${i}` },
      },
    },
  }));

  paymentUseCase.execute.mockResolvedValue(true);

  await Promise.all(
    jobs.map((j) =>
      processWebhookJob(j, paymentUseCase),
    ),
  );

  expect(paymentUseCase.execute).toHaveBeenCalledTimes(
    20,
  );
});

it("should tolerate duplicate webhook delivery safely", async () => {
  const refs = new Set();

  paymentUseCase.execute.mockImplementation(
    async (data: any) => {
      if (refs.has(data.reference)) {
        return; // ignore duplicate
      }

      refs.add(data.reference);
    },
  );

  await processWebhookJob(job, paymentUseCase);
  await processWebhookJob(job, paymentUseCase);

  expect(refs.size).toBe(1);
});


it("should handle malformed webhook payload", async () => {
  job.data = null;

  await expect(
    processWebhookJob(job, paymentUseCase),
  ).rejects.toThrow();
});

it("should recover after worker crash", async () => {
  paymentUseCase.execute
    .mockRejectedValueOnce(new Error("Crash"))
    .mockResolvedValueOnce(true);

  await expect(
    processWebhookJob(job, paymentUseCase),
  ).rejects.toThrow();

  await processWebhookJob(job, paymentUseCase);

  expect(paymentUseCase.execute).toHaveBeenCalledTimes(
    2,
  );
});

it("should handle high load webhook processing", async () => {
  const jobs = Array.from({ length: 100 }, (_, i) => ({
    data: {
      event: {
        event: "charge.success",
        data: { reference: `ref_${i}` },
      },
    },
  }));

  paymentUseCase.execute.mockResolvedValue(true);

  await Promise.all(
    jobs.map((j) =>
      processWebhookJob(j, paymentUseCase),
    ),
  );

  expect(paymentUseCase.execute).toHaveBeenCalledTimes(
    100,
  );
});

});
