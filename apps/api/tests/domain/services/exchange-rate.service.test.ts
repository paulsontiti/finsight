import {
  describe,
  expect,
  it,
} from "vitest";

import { ExchangeRateService } from "../../../src/domain/services/exchange-rate.service";

describe(
  "ExchangeRateService",
  () => {
    const service =
      new ExchangeRateService();

    // ✅ DIRECT CONVERSION
    it(
      "should convert USD to NGN",
      () => {
        const result =
          service.convert(
            1,
            "USD",
            "NGN",
          );

        expect(result).toBe(
          1600,
        );
      },
    );

    // ✅ REVERSE CONVERSION
    it(
      "should convert NGN to USD",
      () => {
        const result =
          service.convert(
            1600,
            "NGN",
            "USD",
          );

        expect(result).toBe(1);
      },
    );

    // ✅ SAME CURRENCY
    it(
      "should return same amount for same currency",
      () => {
        const result =
          service.convert(
            500,
            "NGN",
            "NGN",
          );

        expect(result).toBe(
          500,
        );
      },
    );

    // 🚨 UNKNOWN RATE
    it(
      "should throw if rate unavailable",
      () => {
        expect(() =>
          service.convert(
            100,
            "BTC",
            "DOGE",
          ),
        ).toThrow(
          "Exchange rate unavailable",
        );
      },
    );
  },
);