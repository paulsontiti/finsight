import { describe, it, expect, vi, beforeEach } from "vitest";
import crypto from "crypto";
import { WebhookController } from "../../src/controllers/web-hook.controller";

let webhookRepo: any;
let paymentUseCase: any;
let controller: WebhookController;
let req: any;
let res: any;

beforeEach(() => {
  req = {
    body: {},
    headers: {}
  };

  res = {
    sendStatus: vi.fn(),
    status: vi.fn().mockReturnThis(),
    send: vi.fn()
  };
});

beforeEach(() => {
  webhookRepo = {
    createEvent: vi.fn()
  };

  paymentUseCase = {
    execute: vi.fn()
  };

  controller = new WebhookController(webhookRepo);
});

describe("Webhook Controller",()=>{

it("should store webhook event", async () => {
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
    sendStatus: vi.fn(),
    status: vi.fn().mockReturnThis(),
    send: vi.fn()
  };

  await controller.handle(req, res);

  expect(webhookRepo.createEvent).toHaveBeenCalledWith(
    expect.objectContaining({
      reference: "ref_123"
    })
  );
});

it("should reject invalid signature", async () => {
  req.headers["x-paystack-signature"] = "invalid";

  await controller.handle(req, res);

  expect(res.status).toHaveBeenCalledWith(401);
});

it("should store webhook event when signature is valid", async () => {
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
    sendStatus: vi.fn(),
    status: vi.fn().mockReturnThis(),
    send: vi.fn()
  };

  await controller.handle(req, res);

  expect(webhookRepo.createEvent).toHaveBeenCalledWith(
    expect.objectContaining({
      reference: "ref_123"
    })
  );
});

it("should reject invalid signature", async () => {
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

it("should not call payment use case directly", async () => {
  await controller.handle(req, res);

  expect(paymentUseCase.execute).not.toHaveBeenCalled();
});

it("should return 500 if storing event fails", async () => {
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
    sendStatus: vi.fn(),
    status: vi.fn().mockReturnThis(),
    send: vi.fn()
  };

  webhookRepo.createEvent.mockRejectedValue(new Error());

  await controller.handle(req, res);

  expect(res.sendStatus).toHaveBeenCalledWith(500);
});

})