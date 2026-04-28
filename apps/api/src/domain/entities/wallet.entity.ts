import { Entity } from "./entity.js";

export type WalletStatus = "ACTIVE" | "FROZEN";

export interface WalletProps {
  //id: string;
  userId: string;
  currency: string;
  status: WalletStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class Wallet extends Entity{
  private props: WalletProps;

  private constructor(props: WalletProps) {
    super();
    this.props = props;
  }

  static create(props: Omit<WalletProps, "id" | "status" | "createdAt" | "updatedAt">) {
    return new Wallet({
      //id: crypto.randomUUID(),
      userId: props.userId,
      currency: props.currency,
      status: "ACTIVE",
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }


  get userId() {
    return this.props.userId;
  }

  get currency() {
    return this.props.currency;
  }

  get status() {
    return this.props.status;
  }

  isActive() {
    return this.props.status === "ACTIVE";
  }

  freeze() {
    this.props.status = "FROZEN";
    this.props.updatedAt = new Date();
  }

  unfreeze() {
    this.props.status = "ACTIVE";
    this.props.updatedAt = new Date();
  }
}