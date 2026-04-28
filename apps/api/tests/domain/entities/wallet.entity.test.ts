import { describe, expect, it } from "vitest";
import { Wallet } from "../../../src/domain/entities/wallet.entity";

describe("Wallet Entity", () => {
  it("should create wallet successfully", () => {
    const wallet = Wallet.create({
      userId: "user_1",
      currency: "NGN",
    });

    expect(wallet).toBeDefined();
    expect(wallet.userId).toBe("user_1");
    expect(wallet.currency).toBe("NGN");
  });

  it("should default wallet status to ACTIVE", () => {
    const wallet = Wallet.create({
      userId: "user_1",
      currency: "NGN",
    });

    expect(wallet.status).toBe("ACTIVE");
  });

  it("should generate wallet id", () => {
    const wallet = Wallet.create({
      userId: "user_1",
      currency: "NGN",
    });

    expect(wallet.id).toBeDefined();
  });

  it("should be active by default", () => {
    const wallet = Wallet.create({
      userId: "user_1",
      currency: "NGN",
    });

    expect(wallet.isActive()).toBe(true);
  });

  it("should freeze wallet", () => {
    const wallet = Wallet.create({
      userId: "user_1",
      currency: "NGN",
    });

    wallet.freeze();

    expect(wallet.status).toBe("FROZEN");
  });

  it("should unfreeze wallet", () => {
    const wallet = Wallet.create({
      userId: "user_1",
      currency: "NGN",
    });

    wallet.freeze();
    wallet.unfreeze();

    expect(wallet.status).toBe("ACTIVE");
  });

  it("should not allow userId modification", () => {
    const wallet = Wallet.create({
      userId: "user_1",
      currency: "NGN",
    });

    expect(wallet.userId).toBe("user_1");
  });

  it("should require currency", () => {
    const wallet = Wallet.create({
      userId: "user_1",
      currency: "NGN",
    });

    expect(wallet.currency).toBe("NGN");
  });
});
