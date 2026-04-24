import { randomUUID } from "crypto";

export abstract class Entity {
  public readonly id: string;
  //public readonly props: T;

  constructor(id?: string) {
    this.id = id ?? randomUUID();
    //this.props = props;
  }
}