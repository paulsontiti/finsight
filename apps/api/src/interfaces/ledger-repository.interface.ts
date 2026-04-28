export interface ILedgerRepository {
  createMany(entries: {
    walletId: string;
    transactionId: string;
    type: "DEBIT" | "CREDIT";
    amount: number;
  }[]): Promise<void>;

  findByWalletId(walletId: string): Promise<any[]>;
}