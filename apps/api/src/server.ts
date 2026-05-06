import app from "./app.js";
import prisma from "./prisma.js";
import dotenv from "dotenv";
import { container } from "./shared/container/index.js";

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

<<<<<<< HEAD
// Fetch all users with their posts
const allUsers = await prisma.user.findMany();
console.log("All users:", JSON.stringify(allUsers, null, 2));
=======

// 🚀 START WORKER ON APP START
const webhookProcessor = container.resolve<WebhookProcessor>("webHookRepository");

startWebhookRetryWorker(webhookProcessor);
>>>>>>> c443c4c (feat: build resilient webhook processing system with event logging, retry logic, and failure recovery)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
