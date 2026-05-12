import type { Queue } from "bullmq";

export class FailureRecoveryService {
  constructor(
    private deadLetterQueue: Queue,
  ) {}

  async handleJobFailure(
    job: any,
    error: Error,
  ) {
    await this.deadLetterQueue.add(
      "failed-job",

      {
        originalJob: job.data,

        reason: error.message,

        failedAt: new Date(),
      },

      {
        removeOnComplete: false,
      },
    );
  }
}