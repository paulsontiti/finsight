import { Worker } from "bullmq";
import { redis } from "../api/src/infrastructure/queue/redis.js";
import { deadLetterQueue } from "../api/src/infrastructure/queue/queues.js";
import { PaymentUseCase } from "../api/src/application/use-cases/payment.usecase.js";
import { container } from "../api/src/shared/container/index.js";

const paymentUseCase = container.resolve<PaymentUseCase>("paymentUseCase");

export const processWebhookJob = async (
  job: any,
  paymentUseCase: PaymentUseCase,
) => {
  const event = job.data?.event;

  if (!event) {
    throw new Error("Invalid webhook payload");
  }

  if (event.event === "charge.success") {
    await paymentUseCase.execute(event.data);
  }
};

export const webhookWorker = new Worker(
  "webhook-processing",

  async (job) => {
    try {
      await processWebhookJob(job, paymentUseCase);
    } catch (error: any) {
      // MOVE TO DLQ
      await deadLetterQueue.add(
        "failed-webhook",

        {
          originalJob: job.data,

          reason: error.message,
        },
      );

      throw error;
    }
  },

  {
    connection: redis,

    concurrency: 20,
  },
);

webhookWorker.on("failed", async (job, error) => {
  if (job && job.attemptsMade >= (job.opts.attempts ?? 0)) {
    await deadLetterQueue.add("dead-job", {
      originalJob: job.data,
      error: error.message,
    });
  }
});
