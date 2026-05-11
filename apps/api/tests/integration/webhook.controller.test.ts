import { describe, it, expect, vi, beforeEach } from "vitest";
import crypto from "crypto";

import { WebhookController } from "../../src/controllers/web-hook.controller";

let controller: WebhookController;

let webhookQueue: any;

let req: any;
let res: any;

beforeEach(() => {
    
  webhookQueue = {
    add: vi.fn(),
  };

  controller = new WebhookController(webhookQueue);

  req = {
    body: {},
    headers: {},
  };

  res = {
    sendStatus: vi.fn(),

    status: vi.fn().mockReturnThis(),

    send: vi.fn(),
  };
});

describe("Webhook Controller - Queue Architecture", () => {
  // =====================================================
  // SIGNATURE VALIDATION
  // =====================================================

  it("should reject invalid signature", async () => {
    req.headers["x-paystack-signature"] = "invalid";

    await controller.handle(req, res);

    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.send).toHaveBeenCalledWith("Invalid signature");

    expect(webhookQueue.add).not.toHaveBeenCalled();
  });

  // =====================================================
  // QUEUE ENQUEUE TESTS
  // =====================================================

  it("should enqueue webhook job", async () => {
    const body = {
      event: "charge.success",

      data: {
        reference: "ref_123",
      },
    };

    const signature = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET!)
      .update(JSON.stringify(body))
      .digest("hex");

    req.body = body;

    req.headers["x-paystack-signature"] = signature;

    await controller.handle(req, res);

    expect(webhookQueue.add).toHaveBeenCalledWith(
      "process-webhook",

      {
        event: body,
      },

      expect.objectContaining({
        jobId: "ref_123",

        attempts: 5,

        backoff: {
          type: "exponential",
          delay: 3000,
        },
        // Cleanup
        removeOnComplete: 100,

        // Keep failures for investigation
        removeOnFail: false,
      }),
    );
  });

  // =====================================================
  // RESPONSE TESTS
  // =====================================================

  it("should return 200 immediately after enqueue", async () => {
    const body = {
      event: "charge.success",

      data: {
        reference: "ref_123",
      },
    };

    const signature = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET!)
      .update(JSON.stringify(body))
      .digest("hex");

    req.body = body;

    req.headers["x-paystack-signature"] = signature;

    await controller.handle(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(200);
  });

  // =====================================================
  // DUPLICATE PROTECTION
  // =====================================================

  it("should use reference as jobId for duplicate prevention", async () => {
    const body = {
      event: "charge.success",

      data: {
        reference: "ref_duplicate",
      },
    };

    const signature = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET!)
      .update(JSON.stringify(body))
      .digest("hex");

    req.body = body;

    req.headers["x-paystack-signature"] = signature;

    await controller.handle(req, res);

    const call = webhookQueue.add.mock.calls[0];

    expect(call[2].jobId).toBe("ref_duplicate");
  });

  // =====================================================
  // FAILURE HANDLING
  // =====================================================

  it("should return 500 if queue enqueue fails", async () => {
    const body = {
      event: "charge.success",

      data: {
        reference: "ref_123",
      },
    };

    const signature = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET!)
      .update(JSON.stringify(body))
      .digest("hex");

    req.body = body;

    req.headers["x-paystack-signature"] = signature;

    webhookQueue.add.mockRejectedValue(new Error("Redis unavailable"));

    await controller.handle(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(500);
  });

  // =====================================================
  // RETRY CONFIG TESTS
  // =====================================================

  it("should configure retry attempts", async () => {
    const body = {
      event: "charge.success",

      data: {
        reference: "retry_ref",
      },
    };

    const signature = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET!)
      .update(JSON.stringify(body))
      .digest("hex");

    req.body = body;

    req.headers["x-paystack-signature"] = signature;

    await controller.handle(req, res);

    const options = webhookQueue.add.mock.calls[0][2];

    expect(options.attempts).toBe(5);
  });

  it("should configure exponential backoff", async () => {
    const body = {
      event: "charge.success",

      data: {
        reference: "backoff_ref",
      },
    };

    const signature = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET!)
      .update(JSON.stringify(body))
      .digest("hex");

    req.body = body;

    req.headers["x-paystack-signature"] = signature;

    await controller.handle(req, res);

    const options = webhookQueue.add.mock.calls[0][2];

    expect(options.backoff.type).toBe("exponential");

    expect(options.backoff.delay).toBe(3000);
  });

  // =====================================================
  // CLEANUP CONFIG TESTS
  // =====================================================

  it("should configure completed job cleanup", async () => {
    const body = {
      event: "charge.success",

      data: {
        reference: "cleanup_ref",
      },
    };

    const signature = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET!)
      .update(JSON.stringify(body))
      .digest("hex");

    req.body = body;

    req.headers["x-paystack-signature"] = signature;

    await controller.handle(req, res);

    const options = webhookQueue.add.mock.calls[0][2];

    expect(options.removeOnComplete).toBe(100);
  });

  // =====================================================
  // PAYLOAD INTEGRITY
  // =====================================================

  it("should preserve webhook payload integrity", async () => {
    const body = {
      event: "charge.success",

      data: {
        reference: "ref_123",

        amount: 500000,

        customer: {
          email: "test@example.com",
        },
      },
    };

    const signature = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET!)
      .update(JSON.stringify(body))
      .digest("hex");

    req.body = body;

    req.headers["x-paystack-signature"] = signature;

    await controller.handle(req, res);

    const payload = webhookQueue.add.mock.calls[0][1];

    expect(payload.event.data.amount).toBe(500000);

    expect(payload.event.data.customer.email).toBe("test@example.com");
  });

  // =====================================================
  // ARCHITECTURE TEST
  // =====================================================

  it("should not process payment directly in controller", async () => {
    const body = {
      event: "charge.success",

      data: {
        reference: "ref_123",
      },
    };

    const signature = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET!)
      .update(JSON.stringify(body))
      .digest("hex");

    req.body = body;

    req.headers["x-paystack-signature"] = signature;

    await controller.handle(req, res);

    expect(webhookQueue.add).toHaveBeenCalled();

    // Queue-only architecture
    expect(res.sendStatus).toHaveBeenCalledWith(200);
  });
});
