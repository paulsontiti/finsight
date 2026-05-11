import { Queue } from "bullmq";
import { redis } from "./redis.js";

export const webhookQueue = new Queue(
  "webhook-processing",
  {
    connection: redis,
  },
);

export const reconciliationQueue =
  new Queue("reconciliation", {
    connection: redis,
  });

export const notificationQueue =
  new Queue("notifications", {
    connection: redis,
  });

export const settlementQueue = new Queue(
  "settlement",
  {
    connection: redis,
  },
);

export const deadLetterQueue = new Queue(
  "dead-letter",
  {
    connection: redis,
  },
);