import { Entity } from "./entity.js";

export type WalletStatus = "ACTIVE" | "FROZEN";

export interface WalletProps {
  userId: string;
  balance:number;
  currency: string;
  status: WalletStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWalletProps {
  userId: string;
  currency: string;
  status: WalletStatus;
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
      updatedAt: new Date(),
      balance: props.balance
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

  get balance() {
    return this.props.balance;
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

export class CreateWallet{
  private props: CreateWalletProps;

  private constructor(props: CreateWalletProps) {
    this.props = props;
  }

  static create(props: Omit<CreateWalletProps,  "status">) {
    return new CreateWallet({
      userId: props.userId,
      currency: props.currency,
      status: "ACTIVE",
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

 
}