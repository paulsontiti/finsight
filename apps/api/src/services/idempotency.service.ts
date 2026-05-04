import type { IIdempotencyRepository } from "../interfaces/idempotency-repository.interface.js";
import { hashRequest } from "./hash-request.service.js";

export class IdempotencyService {
  constructor(private repo: IIdempotencyRepository) {}

  async handle<T>({
    key,
    walletId,
    payload,
    handler,
  }: {
    key: string;
    walletId: string;
    payload: any;
    handler: () => Promise<T>;
  }): Promise<T> {
    if (!key || !walletId) {
      throw new Error("Idempotency key/userId required");
    }
    const requestHash = hashRequest(payload);

    const existing = await this.repo.find(key, walletId);

    // 🔁 CASE 1: EXISTING REQUEST
    if (existing) {
      if (existing.requestHash !== requestHash) {
        throw new Error("Idempotency key reused with different payload");
      }

      if (existing.status === "COMPLETED") {
        return existing.response;
      }

      if (existing.status === "PROCESSING") {
        throw new Error("Request already in progress");
      }
    }

    // 🆕 CASE 2: NEW REQUEST
    await this.repo.create({
      key,
      walletId,
      requestHash,
    });

    try {
      await this.repo.updateStatus(key, walletId, "PROCESSING");

      const result = await handler();

      await this.repo.saveResponse(key, walletId, result);
      await this.repo.updateStatus(key, walletId, "COMPLETED");

      return result;
    } catch (error) {
      await this.repo.updateStatus(key, walletId, "FAILED");
      throw error;
    }
  }
}
