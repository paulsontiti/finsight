import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { LedgerSnapshotService } from "../../../src/domain/services/ledger-snapshot.service";

describe(
  "LedgerSnapshotService",
  () => {
    let ledgerRepo: any;

    let snapshotRepo: any;

    let service: LedgerSnapshotService;

    beforeEach(() => {
      ledgerRepo = {
        findByWalletId: vi.fn(),
        findAfterDate: vi.fn(),
      };

      snapshotRepo = {
        create: vi.fn(),
        findLatestByWallet:
          vi.fn(),
      };

      service =
        new LedgerSnapshotService(
          ledgerRepo,
          snapshotRepo,
        );
    });

    // ✅ CREATE SNAPSHOT
    it(
      "should create ledger snapshot",
      async () => {
        ledgerRepo.findByWalletId.mockResolvedValue(
          [
            {
              type: "CREDIT",
              amount: 5000,
            },

            {
              type: "DEBIT",
              amount: 1000,
            },
          ],
        );

        snapshotRepo.create.mockResolvedValue(
          {
            id: "snapshot_1",
          },
        );

        const result =
          await service.createSnapshot(
            "wallet_1",
          );

        expect(
          snapshotRepo.create,
        ).toHaveBeenCalledWith({
          walletId:
            "wallet_1",

          balance: 4000,

          ledgerCount: 2,
        });

        expect(result).toEqual({
          id: "snapshot_1",
        });
      },
    );

    // ⚡ REBUILD BALANCE
    it(
      "should rebuild balance from snapshot",
      async () => {
        snapshotRepo.findLatestByWallet.mockResolvedValue(
          {
            balance: 10000,

            snapshotAt:
              new Date(),
          },
        );

        ledgerRepo.findAfterDate.mockResolvedValue(
          [
            {
              type: "CREDIT",
              amount: 500,
            },

            {
              type: "DEBIT",
              amount: 200,
            },
          ],
        );

        const balance =
          await service.rebuildBalance(
            "wallet_1",
          );

        expect(balance).toBe(
          10300,
        );
      },
    );

    // 🚨 NO SNAPSHOT
    it(
      "should return zero if no snapshot exists",
      async () => {
        snapshotRepo.findLatestByWallet.mockResolvedValue(
          null,
        );

        const result =
          await service.rebuildBalance(
            "wallet_1",
          );

        expect(result).toBe(0);
      },
    );

    // 🚨 EMPTY LEDGER
    it(
      "should create zero-balance snapshot for empty ledger",
      async () => {
        ledgerRepo.findByWalletId.mockResolvedValue(
          [],
        );

        await service.createSnapshot(
          "wallet_1",
        );

        expect(
          snapshotRepo.create,
        ).toHaveBeenCalledWith({
          walletId:
            "wallet_1",

          balance: 0,

          ledgerCount: 0,
        });
      },
    );

    // 🚨 DB FAILURE
    it(
      "should throw on database failure",
      async () => {
        ledgerRepo.findByWalletId.mockRejectedValue(
          new Error("DB failure"),
        );

        await expect(
          service.createSnapshot(
            "wallet_1",
          ),
        ).rejects.toThrow(
          "DB failure",
        );
      },
    );

    // 🚀 LARGE LEDGER
    it(
      "should process large ledgers efficiently",
      async () => {
        const entries =
          Array.from(
            { length: 1000 },
            () => ({
              type: "CREDIT",
              amount: 100,
            }),
          );

        ledgerRepo.findByWalletId.mockResolvedValue(
          entries,
        );

        await service.createSnapshot(
          "wallet_1",
        );

        expect(
          snapshotRepo.create,
        ).toHaveBeenCalledWith({
          walletId:
            "wallet_1",

          balance: 100000,

          ledgerCount: 1000,
        });
      },
    );
  },
);