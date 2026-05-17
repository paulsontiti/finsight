export interface LedgerEntryProps{
    walletId: string;
    transactionId: string;
    type: "DEBIT" | "CREDIT";
    amount: number;
  }

export interface ILedgerRepository {
  createMany(entries: LedgerEntryProps[]): Promise<void>;

  findByWalletId(walletId: string): Promise<any[]>;
  findAfterDate(walletId: string,snapshotAt:Date): Promise<any[]>;
}