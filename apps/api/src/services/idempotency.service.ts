import type { IIdempotencyRepository } from "../interfaces/idempotency-repository.interface.js";
import { hashRequest } from "./hash-request.service.js";

export class IdempotencyService {
  constructor(private repo: IIdempotencyRepository) {}

  async handle<T>({
    key,
    userId,
    payload,
    handler,
  }: {
    key: string;
    userId: string;
    payload: any;
    handler: () => Promise<T>;
  }): Promise<T> {

    if(!key || !userId){
        throw new Error("Idempotency key/userId required");
    }
    const requestHash = hashRequest(payload);

    const existing = await this.repo.find(key, userId);

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
      userId,
      requestHash,
    });

    try {
      await this.repo.updateStatus(key, userId, "PROCESSING");

      const result = await handler();

      await this.repo.saveResponse(key, userId, result);
      await this.repo.updateStatus(key, userId, "COMPLETED");

      return result;
    } catch (error) {
      await this.repo.updateStatus(key, userId, "FAILED");
      throw error;
    }
  }
}
