import { describe, it, expect, vi, beforeEach } from "vitest";
import crypto from "crypto";
import { WebhookController } from "../../src/controllers/web-hook.controller"
import {container} from "../../src/shared/container/index"

let webhookRepo: any;
let paymentUseCase: any;
let controller: WebhookController;
const config = container.resolve<any>("configService");
const paystackSecret = config.get("PAYSTACK_SECRET")

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
    .createHmac("sha512", paystackSecret)
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

})