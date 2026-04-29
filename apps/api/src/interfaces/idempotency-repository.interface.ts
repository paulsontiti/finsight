
export interface IIdempotencyRepository {
  find(key: string, userId: string): Promise<any | null>;

  create(data: {
    key: string;
    userId: string;
    requestHash: string;
  }): Promise<void>;

  saveResponse(key: string, userId: string, response: any): Promise<void>;

  updateStatus(
    key: string,
    userId: string,
    status: "PROCESSING" | "COMPLETED" | "FAILED"
  ): Promise<void>;
}