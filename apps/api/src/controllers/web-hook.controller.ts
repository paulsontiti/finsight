import crypto from "crypto";
import type { PaymentUseCase } from "../application/use-cases/payment.usecase.js";

export class WebhookController {
  constructor(private paymentUseCase: PaymentUseCase | any) {}

  async handle(req: any, res: any) {
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET!)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      return res.status(401).send("Invalid signature")
    }

    const event = req.body;

    if (event.event === "charge.success") {
      await this.paymentUseCase.execute(event.data);
    }

    res.sendStatus(200);
  }
}