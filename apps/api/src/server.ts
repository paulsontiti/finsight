import app from "./app.js";
import prisma from "./prisma.js";
import dotenv from "dotenv";
import { container } from "./shared/container/index.js";
import { startWebhookRetryWorker } from "./services/webhook-retyr-worker.service.js";
import type { WebhookProcessor } from "./services/webhook-processor.service.js";

dotenv.config();

//enforce required envs at startup
const config = container.resolve<any>("configService");
const requiredEnv = ["DATABASE_URL", "JWT_SECRET", "PORT","PAYSTACK_SECRET"];
requiredEnv.forEach((key) => {
  console.log(config.get(key))
  if (!process.env[key]) {
    throw new Error(`Missing required env: ${key}`);
  }
});

const PORT = config.get("PORT");



// 🚀 START WORKER ON APP START
const webhookProcessor = container.resolve<WebhookProcessor>("webHookRepository");

startWebhookRetryWorker(webhookProcessor);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
