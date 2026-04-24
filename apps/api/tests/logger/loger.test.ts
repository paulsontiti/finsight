import { describe, it, expect, vi } from "vitest";
import { Logger } from "../../src/shared/logger/logger.js";
import { TransactionLogger } from "../../src/shared/logger/transaction.logger.js";

describe("Logger", () => {
  it("should log message", () => {
    const logger = new Logger();

    const spy = vi.spyOn(console, "log");

    logger.info("test message");

    expect(spy).toHaveBeenCalled();
  });

  it("should log transaction", () => {
    const logger = new TransactionLogger();

    const spy = vi.spyOn(console, "log");

    logger.logTransaction({
      transactionId: "1",
      walletId: "w1",
      amount: 100,
      type: "CREDIT",
      status: "SUCCESS",
    });

    expect(spy).toHaveBeenCalled();
  });
});
