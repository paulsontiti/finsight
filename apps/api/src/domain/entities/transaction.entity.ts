import { Entity } from "./entity.js";

export type TransactionType =
  | "WALLET_FUNDING"
  | "TRANSFER"
  | "WITHDRAWAL"
  | "PAYMENT";

export type TransactionStatus = "PENDING" | "SUCCESS" | "FAILED";

export interface TransactionProps {
  //id: string;
  userId: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  reference: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export class Transaction extends Entity {
  private props: TransactionProps;

  private constructor(props: TransactionProps) {
    super();
    this.props = props;
  }

  static create(
    props: Omit<TransactionProps, "id" | "status" | "createdAt" | "updatedAt">,
  ) {
    if (props.amount <= 0) {
      throw new Error("Transaction amount must be greater than zero");
    }
     if (!props.reference) {
      throw new Error("Refrence is required");
    }

    return new Transaction({
      //id: crypto.randomUUID(),
      userId: props.userId,
      type: props.type,
      amount: props.amount,
      reference: props.reference,

      status: "PENDING",
      createdAt: new Date(),
      updatedAt: new Date(),
      ...(props.metadata && { metadata: props.metadata }),
    });
  }

  get status() {
    return this.props.status;
  }

  get amount() {
    return this.props.amount;
  }

  get type() {
    return this.props.type;
  }

  get reference() {
    return this.props.reference;
  }

  markSuccess() {
    this.props.status = "SUCCESS";
    this.props.updatedAt = new Date();
  }

  markFailed() {
    this.props.status = "FAILED";
    this.props.updatedAt = new Date();
  }

  isPending() {
    return this.props.status === "PENDING";
  }
}
