import { Entity } from "./entity.js";

export type EntryType = "DEBIT" | "CREDIT";

export interface LedgerEntryProps {
  //   id: string;
  walletId: string;
  transactionId: string;
  type: EntryType;
  amount: number;
  description?: string;
  createdAt: Date;
}

export class LedgerEntry extends Entity {
  private props: LedgerEntryProps;

  private constructor(props: LedgerEntryProps) {
    super();
    this.props = props;
  }

  static create(props: Omit<LedgerEntryProps, "id" | "createdAt">) {
    if (props.amount <= 0) {
      throw new Error("Ledger amount must be greater than zero");
    }
    if (!props.transactionId) {
      throw new Error("Ledger transaction Id is required");
    }

    return new LedgerEntry({
      //id: crypto.randomUUID(),
      walletId: props.walletId,
      transactionId: props.transactionId,
      type: props.type,
      amount: props.amount,
      createdAt: new Date(),
      ...(props.description && { description: props.description }),
    });
  }

  get walletId() {
    return this.props.walletId;
  }

  get type() {
    return this.props.type;
  }

  get amount() {
    return this.props.amount;
  }

  get transactionId() {
    return this.props.transactionId;
  }
}
