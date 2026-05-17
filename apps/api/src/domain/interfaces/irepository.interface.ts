export interface IRepository<Input, Output> {
  create(entity: Input): Promise<Output>;
  findById(id: string): Promise<Output | null>;
}