import type { ILedgerSnapshotRepository } from "../interfaces/iLedgerSnapshotRepository.interface.js";
import type { ILedgerRepository } from "../interfaces/ledger-repository.interface.js";

export class LedgerSnapshotService {
  constructor(
    private ledgerRepo: ILedgerRepository,

    private snapshotRepo: ILedgerSnapshotRepository,
  ) {}

  // CREATE WALLET SNAPSHOT
  async createSnapshot(
    walletId: string,
  ) {
    const entries =
      await this.ledgerRepo.findByWalletId(
        walletId,
      );

    const balance =
      entries.reduce(
        (
          sum: number,
          entry: any,
        ) => {
          if (
            entry.type === "CREDIT"
          ) {
            return (
              sum + entry.amount
            );
          }

          return (
            sum - entry.amount
          );
        },

        0,
      );

    return this.snapshotRepo.create({
      walletId,

      balance,

      ledgerCount:
        entries.length,
    });
  }

  // REBUILD BALANCE FROM SNAPSHOT
  async rebuildBalance(
    walletId: string,
  ) {
    const snapshot =
      await this.snapshotRepo.findLatestByWallet(
        walletId,
      );

    if (!snapshot) {
      return 0;
    }

    const entries =
      await this.ledgerRepo.findAfterDate(
        walletId,
        snapshot.snapshotAt,
      );

    let balance =
      snapshot.balance;

    for (const entry of entries) {
      if (
        entry.type === "CREDIT"
      ) {
        balance += entry.amount;
      } else {
        balance -= entry.amount;
      }
    }

    return balance;
  }
}