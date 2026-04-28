export interface ITransactionRepository {
  create(data: {
    userId: string;
    type: string;
    amount: number;
    reference: string;
  }): Promise<{ id: string,type:string }>;

  updateStatus(id: string, status: "PENDING" | "SUCCESS" | "FAILED"): Promise<void>;

  findByReference(reference: string): Promise<any | null>;
}