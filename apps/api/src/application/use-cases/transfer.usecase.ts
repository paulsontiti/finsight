import type { PrismaClient } from "../../../generated/prisma/client.js";
import type { WalletRepository } from "../../domain/repositories/wallet.repository.js";
import type {
  ILedgerRepository,
  LedgerEntryProps,
} from "../../interfaces/ledger-repository.interface.js";
import type { ITransactionRepository } from "../../interfaces/transaction-repository.interface.js";
import type { IdempotencyService } from "../../services/idempotency.service.js";
import type { UseCase } from "../interfaces/useCase.js";

interface TransferUsecaseInputProps {
  walletId: string;
  receiverWalletId: string;
  amount: number;
  reference: string;
  idempotencyKey: string;
}

interface TransferUsecaseOutputProps {
  senderBalance: number;
  receiverBalance: number;
  transactionId: string;
}
export class TransferUseCase implements UseCase<
  TransferUsecaseInputProps,
  TransferUsecaseOutputProps
> {
  constructor(
    private walletRepo: WalletRepository,
    private transactionRepo: ITransactionRepository,
    private ledgerRepo: ILedgerRepository,
    private idempotencyService: IdempotencyService,
    private prisma: PrismaClient,
  ) {}

  async execute(input: TransferUsecaseInputProps) {
    return this.idempotencyService.handle({
      key: input.idempotencyKey,
      walletId: input.walletId,
      payload: input,
      handler: async () => this.executeTransferLogic(input),
    });
  }

  private async executeTransferLogic(input: {
    walletId: string;
    receiverWalletId: string;
    amount: number;
    reference: string;
  }) {
    try {
      const existing = await this.transactionRepo.findByReference(
        input.reference,
      );
      if (existing) {
        throw new Error("Duplicate transaction");
      }
      if (input.amount <= 0) {
        throw new Error("Invalid amount");
      }

      if (input.walletId === input.receiverWalletId) {
        throw new Error("Cannot transfer to self");
      }

      let senderWallet: any;
      let receiverWallet: any;

      const data = await this.walletRepo.getSenderReceiverWallets(
        input.walletId,
        input.receiverWalletId,
      );
      senderWallet = data.senderWallet;
      receiverWallet = data.receiverWallet;

      if (!senderWallet || !receiverWallet) {
        throw new Error("Wallet not found");
      }
      if (senderWallet.balance < input.amount) {
        throw new Error("Insufficient balance");
      }

      return this.prisma.$transaction(async (tx: any) => {
        // 1. Create transaction
        const txRecord = await this.transactionRepo.create({
          walletId: input.walletId,
          type: "TRANSFER",
          amount: input.amount,
          reference: input.reference,
        });

        // 2. Ledger entries (4 entries)
        const entries: LedgerEntryProps[] = [
          // Sender
          {
            walletId: senderWallet.id,
            transactionId: txRecord.id,
            type: "DEBIT",
            amount: input.amount,
          },
          // {
          //   walletId: "SYSTEM_ACCOUNT",
          //   transactionId: txRecord.id,
          //   type: "CREDIT" as const,
          //   amount: input.amount,
          // },
          // {
          //   walletId: "SYSTEM_ACCOUNT",
          //   transactionId: txRecord.id,
          //   type: "DEBIT" as const,
          //   amount: input.amount,
          // },
          {
            walletId: receiverWallet.id,
            transactionId: txRecord.id,
            type: "CREDIT",
            amount: input.amount,
          },
        ];

        await this.ledgerRepo.createMany(entries);

        // 3. Update balances (ATOMIC)
        try {
          const debitResult = await this.walletRepo.safeDebit(
            input.walletId,
            input.amount,
            senderWallet.version,
          );
          if (!debitResult || debitResult.count === 0) {
            throw new Error("Concurrent update or insufficient balance");
          }
        } catch (err: any) {
          throw new Error(err.message);
        }

        const creditResult = await this.walletRepo.safeCredit(
          input.receiverWalletId,
          input.amount,
          receiverWallet.version,
        );

        if (!creditResult || creditResult.count === 0) {
          throw new Error("Receiver wallet modified concurrently");
        }

        const updatedSender = await this.walletRepo.findById(input.walletId);
        // tx.wallet.findUnique({
        //   where: {
        //     id: senderWallet.id,
        //   },
        // });

        const updatedReceiver = await this.walletRepo.findById(
          input.receiverWalletId,
        );
        // const updatedBalances = await this.walletRepo.safeTransfer(
        //   senderWallet.id,
        //   receiverWallet.id,
        //   input.amount,
        // );

        // const updatedReceiver = await this.walletRepo.updateBalance(
        //   receiverWallet.id,
        //   receiverWallet.balance + input.amount,
        // );

        // 4. Mark success
        await this.transactionRepo.updateStatus(txRecord.id, "SUCCESS");

        return {
          senderBalance: updatedSender.balance,
          receiverBalance: updatedReceiver.balance,
          transactionId: txRecord.id,
        };
      });
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
