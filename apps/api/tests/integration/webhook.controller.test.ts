import crypto from "crypto";
import { describe, expect, it, vi } from "vitest";
import { WebhookController } from "../../src/controllers/web-hook.controller";
import { container } from "../../src/shared/container/index";

describe("Webhook Controller", () => {
  const execute = vi.fn().mockResolvedValue({});
  const controller = new WebhookController({ execute });
  const config = container.resolve<any>("configService");
  const payStackSecret = config.get("PAYSTACK_SECRET");
  it("should process valid webhook", async () => {
    const body = { event: "charge.success", data: {} };

    const signature = crypto
      .createHmac("sha512", payStackSecret)
      .update(JSON.stringify(body))
      .digest("hex");

    const req: any = {
      body,
      headers: { "x-paystack-signature": signature },
    };

    const res: any = {
      sendStatus: vi.fn(),
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };

    await controller.handle(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(200);
  });

  it("should reject invalid webhook signature", async () => {
  const req: any = {
    body: {},
    headers: { "x-paystack-signature": "invalid" }
  };

  const res: any = {
    status: vi.fn().mockReturnThis(),
    send: vi.fn()
  };

  await controller.handle(req, res);

  expect(res.status).toHaveBeenCalledWith(401);
});

it("should call payment use case on charge.success", async () => {
  const body = {
    event: "charge.success",
    data: { reference: "ref_123" }
  };

  const signature = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET!)
    .update(JSON.stringify(body))
    .digest("hex");

  const req: any = {
    body,
    headers: { "x-paystack-signature": signature }
  };

  const res: any = {
    sendStatus: vi.fn()
  };

  await controller.handle(req, res);

  expect(paymentUseCase.handleSuccessfulPayment).toHaveBeenCalled();
});
});
