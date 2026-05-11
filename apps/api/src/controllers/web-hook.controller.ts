import crypto from "crypto";

import { container } from "../shared/container/index.js";
import type { Queue } from "bullmq";

export class WebhookController {
  constructor(private webhookQueue: Queue) {}

  async handle(req: any, res: any) {
    try {
      const config = container.resolve<any>("configService");
      const paystackSecret = config.get("PAYSTACK_SECRET");
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

        //Enqeue Job
      await this.webhookQueue.add(
        "process-webhook",

        {
          event,
        },

        {
          // Prevent duplicate webhook processing
          jobId: event.data.reference,

          // Retry automatically
          attempts: 5,

          // Exponential retry backoff
          backoff: {
            type: "exponential",
            delay: 3000,
          },

          // Cleanup
          removeOnComplete: 100,

          // Keep failures for investigation
          removeOnFail: false,
        },
      );

      // ✅ 3. RESPOND FAST (VERY IMPORTANT)
      return res.sendStatus(200);
    } catch (error) {
      return res.sendStatus(500);
    }
  }
}
