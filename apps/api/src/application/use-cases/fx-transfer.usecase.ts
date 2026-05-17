import type { IWalletRepository } from "../../domain/interfaces/wallet-repository.interface.js";
import type { ExchangeRateService } from "../../domain/services/exchange-rate.service.js";

export class FxTransferUseCase {
  constructor(
    private walletRepo: IWalletRepository,

    private exchangeRateService: ExchangeRateService,
  ) {}

  async execute(input: {
    senderWalletId: string;

    receiverWalletId: string;

    amount: number;
  }) {
    const senderWallet =
      await this.walletRepo.findById(
        input.senderWalletId,
      );

    const receiverWallet =
      await this.walletRepo.findById(
        input.receiverWalletId,
      );

    // 💱 CONVERT
    const convertedAmount =
      this.exchangeRateService.convert(
        input.amount,

        senderWallet?.currency as string,

        receiverWallet?.currency as string,
      );

    // ➖ DEBIT
    await this.walletRepo.safeDebit(
      senderWallet?.id as string,

      input.amount,

      senderWallet?.version as number,
    );

    // ➕ CREDIT
    await this.walletRepo.updateBalanceWithVersion(
      receiverWallet?.id as string,

      receiverWallet?.version as number,

      convertedAmount,
    );

    return {
      debited:
        input.amount,

      credited:
        convertedAmount,

      from:
        senderWallet?.currency,

      to:
        receiverWallet?.currency,
    };
  }
}