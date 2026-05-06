import crypto from "crypto";
import type { WebhookRepository } from "../domain/repositories/webhook.repository.js";
import { container } from "../shared/container/index.js";

export class WebhookController {
  constructor(private webhookRepo: WebhookRepository) {}

  async handle(req: any, res: any) {
    try {
      const config = container.resolve<any>("configService");
const paystackSecret = config.get("PAYSTACK_SECRET")
      const signature = req.headers["x-paystack-signature"];

      const hash = crypto
        .createHmac("sha512", paystackSecret)
        .update(JSON.stringify(req.body))
        .digest("hex");

      // 🔐 1. VERIFY SIGNATURE
      if (hash !== signature) {
        return res.status(401).send("Invalid signature");
      }

      const event = req.body;

      // 🧠 2. STORE EVENT (CRITICAL)
      await this.webhookRepo.createEvent({
        provider: "paystack",
        eventType: event.event,
        reference: event.data.reference,
        payload: event
      });

      // ✅ 3. RESPOND FAST (VERY IMPORTANT)
      return res.sendStatus(200);

    } catch (error) {
      return res.sendStatus(500);
    }
  }
}