import type { PrismaTransactionRepository } from "../../domain/repositories/prisma-transaction.repository.js";
import type { WalletRepository } from "../../domain/repositories/wallet.repository.js";
import type { UseCase } from "../interfaces/useCase.js";

export interface FraudCheckInput {
  userId: string;
  amount: number;
  receiverId?: string;
  deviceId?: string;
  ip?: string;
}

export class FraudDetectionUseCase implements UseCase<FraudCheckInput,{status:string}> {
  constructor(
    private transactionRepo: PrismaTransactionRepository,
    private walletRepo: WalletRepository,
  ) {}

  // 🚀 MAIN ENTRY
  async execute(input: FraudCheckInput) {
    await this.checkVelocity(input);

    await this.checkAmountAnomaly(input);

    await this.checkDeviceMismatch(input);

    await this.checkCircularTransfer(input);

    return {
      status: "SAFE",
    };
  }

  // 🚀 1. VELOCITY CHECK
  async checkVelocity(input: FraudCheckInput) {
    const recent =
      await this.transactionRepo.countRecentByUser(
        input.userId,
        60, // last 60 seconds
      );

    if (recent > 10) {
      throw new Error(
        "Velocity limit exceeded",
      );
    }
  }

  // 💰 2. AMOUNT ANOMALY
  async checkAmountAnomaly(input: FraudCheckInput) {
    const avg =
      await this.transactionRepo.getUserAverageAmount(
        input.userId,
      );

    const threshold = avg * 5;

    if (input.amount > threshold) {
      throw new Error(
        "Suspicious amount detected",
      );
    }
  }

  // 🌍 3. DEVICE / IP MISMATCH
  async checkDeviceMismatch(
    input: FraudCheckInput,
  ) {
    const knownDevices =
      await this.walletRepo.getKnownDevices(
        input.userId,
      );

    const knownIps =
      await this.walletRepo.getKnownIps(
        input.userId,
      );

    if (
      input.deviceId &&
      !knownDevices.includes(input.deviceId)
    ) {
      throw new Error(
        "New device detected",
      );
    }

    if (
      input.ip &&
      !knownIps.includes(input.ip)
    ) {
      throw new Error(
        "New IP detected",
      );
    }
  }

  // 🔁 4. CIRCULAR TRANSFER DETECTION
  async checkCircularTransfer(
    input: FraudCheckInput,
  ) {
    if (!input.receiverId) return;

    const lastTransfers =
      await this.transactionRepo.findRecentTransfers(
        input.userId,
      );

    const hasLoop = lastTransfers.some(
      (t: any) =>
        t.from === input.receiverId &&
        t.to === input.userId,
    );

    if (hasLoop) {
      throw new Error(
        "Circular transfer detected",
      );
    }
  }
}