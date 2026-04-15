import { randomUUID } from "crypto";

export abstract class Entity<T> {
  public readonly id: string;
  public readonly props: T;

  constructor(props: T, id?: string) {
    this.id = id ?? randomUUID();
    this.props = props;
  }
}