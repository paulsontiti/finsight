import { Worker } from "bullmq";
import { redis } from "../queue/redis.js";
import { deadLetterQueue } from "../queue/queues.js";
import { PaymentUseCase } from "../../application/use-cases/payment.usecase.js";
import { container } from "../../shared/container/index.js";


const paymentUseCase = container.resolve<PaymentUseCase>("paymentUseCase");

export const webhookWorker = new Worker(
  "webhook-processing",

  async (job) => {
    const event = job.data.event;

    console.log("Processing webhook:", event.event);

    // Execute business logic here
    if (event.eventType === "charge.success") {
          await paymentUseCase.execute(
            event.payload.data
          );
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
