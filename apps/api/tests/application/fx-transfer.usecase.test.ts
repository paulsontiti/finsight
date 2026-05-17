import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { FxTransferUseCase } from "../../src/application/use-cases/fx-transfer.usecase";

describe(
  "FxTransferUseCase",
  () => {
    let walletRepo: any;

    let exchangeRateService: any;

    let useCase: FxTransferUseCase;

    beforeEach(() => {
      walletRepo = {
        findById: vi.fn(),

        safeDebit: vi.fn(),

        updateBalanceWithVersion:
          vi.fn(),
      };

      exchangeRateService = {
        convert: vi.fn(),
      };

      useCase =
        new FxTransferUseCase(
          walletRepo,
          exchangeRateService,
        );
    });

    // ✅ FX TRANSFER
    it(
      "should transfer across currencies",
      async () => {
        walletRepo.findById
          .mockResolvedValueOnce({
            id: "usd_wallet",

            currency: "USD",

            version: 1,
          })

          .mockResolvedValueOnce({
            id: "ngn_wallet",

            currency: "NGN",

            version: 1,
          });

        exchangeRateService.convert.mockReturnValue(
          160000,
        );

        const result =
          await useCase.execute({
            senderWalletId:
              "usd_wallet",

            receiverWalletId:
              "ngn_wallet",

            amount: 100,
          });

        expect(
          walletRepo.safeDebit,
        ).toHaveBeenCalled();

        expect(
          walletRepo.updateBalanceWithVersion,
        ).toHaveBeenCalled();

        expect(
          result.credited,
        ).toBe(160000);
      },
    );

    // 🚨 FX FAILURE
    it(
      "should fail if exchange rate unavailable",
      async () => {
        walletRepo.findById
          .mockResolvedValueOnce({
            currency: "BTC",
          })

          .mockResolvedValueOnce({
            currency: "DOGE",
          });

        exchangeRateService.convert.mockImplementation(
          () => {
            throw new Error(
              "Exchange rate unavailable",
            );
          },
        );

        await expect(
          useCase.execute({
            senderWalletId:
              "a",

            receiverWalletId:
              "b",

            amount: 100,
          }),
        ).rejects.toThrow(
          "Exchange rate unavailable",
        );
      },
    );

    // 🚨 INSUFFICIENT BALANCE
    it(
      "should fail on insufficient balance",
      async () => {
        walletRepo.findById
          .mockResolvedValueOnce({
            id: "usd_wallet",

            currency: "USD",

            version: 1,
          })

          .mockResolvedValueOnce({
            id: "ngn_wallet",

            currency: "NGN",

            version: 1,
          });

        exchangeRateService.convert.mockReturnValue(
          160000,
        );

        walletRepo.safeDebit.mockRejectedValue(
          new Error(
            "Insufficient balance",
          ),
        );

        await expect(
          useCase.execute({
            senderWalletId:
              "usd_wallet",

            receiverWalletId:
              "ngn_wallet",

            amount: 100,
          }),
        ).rejects.toThrow(
          "Insufficient balance",
        );
      },
    );
  },
);