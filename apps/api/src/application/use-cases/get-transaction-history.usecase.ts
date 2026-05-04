import type { UseCase } from "../interfaces/useCase.js";

interface TransactionHistoryInputProps {
  userId: string;
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
  fromDate?: Date;
  toDate?: Date;
}
export class GetTransactionHistoryUseCase implements UseCase<
  TransactionHistoryInputProps,
  any[]
> {
  constructor(private transactionRepo: any) {}

  async execute(input: TransactionHistoryInputProps) {
    const page = input.page ?? 1;
    const limit = input.limit ?? 10;

    const result = await this.transactionRepo.findMany({
      userId: input.userId,
      page,
      limit,
      type: input.type,
      status: input.status,
      fromDate: input.fromDate,
      toDate: input.toDate,
    });

    return result;
  }
}
