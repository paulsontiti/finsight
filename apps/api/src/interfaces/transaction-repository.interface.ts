export interface ITransactionRepository {
  create(data: {
    walletId: string;
    type: string;
    amount: number;
    reference: string;
    description?: string;
  }): Promise<{ id: string }>;
  updateStatus(id: string, status: "PENDING" | "SUCCESS" | "FAILED"): Promise<void>;

  findByReference(reference: string): Promise<any | null>;
  findMany(params: {
    walletId: string;
    page: number;
    limit: number;
    type?: string;
    status?: string;
    fromDate?: Date;
    toDate?: Date;
  }): Promise<any>;
}
