import cron from "node-cron";
import type { WebhookProcessor } from "./webhook-processor.service.js";

export function startWebhookRetryWorker(processor: WebhookProcessor) {
  cron.schedule("*/1 * * * *", async () => {
    await processor.processBatch();
  });
}