export class PaymentUseCase {
  constructor(
    private walletRepo: any,
    private transactionRepo: any,
    private ledgerRepo: any,
    private idempotencyService: any,
    private prisma: any
  ) {}

  async execute(data: any) {
    const reference = data.reference;
    const amount = data.amount / 100; // convert from kobo
    const userId = data.metadata.userId;

    return this.idempotencyService.handle({
      key: reference, // 🔥 use gateway reference
      userId,
      payload: data,
      handler: async () => {
        return this.fundWallet({
          userId,
          amount,
          reference
        });
      }
    });
  }

  private async fundWallet(input: {
    userId: string;
    amount: number;
    reference: string;
  }) {
    const wallet = await this.walletRepo.findByUserId(input.userId);

    if (!wallet) throw new Error("Wallet not found");

    return this.prisma.$transaction(async () => {
      const tx = await this.transactionRepo.create({
        walletId: wallet.id,
        amount: input.amount,
        type: "FUNDING",
        reference: input.reference,
        description: "Paystack funding"
      });

      const entries = [
        {
          walletId: wallet.id,
          transactionId: tx.id,
          type: "CREDIT",
          amount: input.amount
        },
        {
          walletId: "SYSTEM",
          transactionId: tx.id,
          type: "DEBIT",
          amount: input.amount
        }
      ];

      await this.ledgerRepo.createMany(entries);

      const updatedWallet = await this.walletRepo.updateBalance(
        wallet.id,
        wallet.balance + input.amount
      );

      await this.transactionRepo.updateStatus(tx.id, "SUCCESS");

      return {
        balance: updatedWallet.balance
      };
    });
  }
}