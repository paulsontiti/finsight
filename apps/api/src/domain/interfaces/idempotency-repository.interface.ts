
export interface IIdempotencyRepository {
  find(key: string, walletId: string): Promise<any | null>;

  create(data: {
    key: string;
    walletId: string;
    requestHash: string;
  }): Promise<void>;

  saveResponse(key: string, walletId: string, response: any): Promise<void>;

  updateStatus(
    key: string,
    walletId: string,
    status: "PROCESSING" | "COMPLETED" | "FAILED"
  ): Promise<void>;
}