import type { PaymentUseCase } from "../application/use-cases/payment.usecase.js";
import type { WebhookRepository } from "../domain/repositories/webhook.repository.js";

export class WebhookProcessor {
  constructor(
    private webhookRepo: WebhookRepository,
    private paymentUseCase: PaymentUseCase
  ) {}

  async processBatch() {
    const events = await this.webhookRepo.findPending(10);

    for (const event of events) {
      try {
        if (event.eventType === "charge.success") {
          await this.paymentUseCase.execute(
            event.payload.data
          );
        }

        await this.webhookRepo.markProcessed(event.id);
      } catch (error) {
        await this.webhookRepo.markFailed(event.id);
      }
    }
  }
}