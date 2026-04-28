export interface IIdempotencyRepository {
  find(key: string): Promise<{ response: any } | null>;
  save(key: string, response: any): Promise<void>;
}