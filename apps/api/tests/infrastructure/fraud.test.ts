import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { FraudDetectionUseCase } from "../../src/application/use-cases/fraud-detection.usecase";

let transactionRepo: any;
let walletRepo: any;

let fraudDetectionUseCase: FraudDetectionUseCase;

beforeEach(() => {
  transactionRepo = {
    countRecentByUser: vi.fn(),
    getUserAverageAmount: vi.fn(),
    findRecentTransfers: vi.fn(),
  };

  walletRepo = {
    getKnownDevices: vi.fn(),
    getKnownIps: vi.fn(),
  };

  fraudDetectionUseCase =
    new FraudDetectionUseCase(
      transactionRepo,
      walletRepo,
    );
});

describe("Fraud Detection UseCase", () => {
  // 🚀 VELOCITY CHECK
  it("should detect rapid transfers (velocity attack)", async () => {
    transactionRepo.countRecentByUser.mockResolvedValue(
      15,
    );

    await expect(
      fraudDetectionUseCase.checkVelocity({
        userId: "user_1",
        amount: 1000,
      }),
    ).rejects.toThrow(
      "Velocity limit exceeded",
    );

    expect(
      transactionRepo.countRecentByUser,
    ).toHaveBeenCalledWith(
      "user_1",
      60,
    );
  });

  // 💰 AMOUNT ANOMALY
  it("should detect abnormal transaction amount spike", async () => {
    transactionRepo.getUserAverageAmount.mockResolvedValue(
      1000,
    );

    await expect(
      fraudDetectionUseCase.checkAmountAnomaly(
        {
          userId: "user_1",
          amount: 50000,
        },
      ),
    ).rejects.toThrow(
      "Suspicious amount detected",
    );
  });

  // 🌍 NEW DEVICE
  it("should detect new device anomaly", async () => {
    walletRepo.getKnownDevices.mockResolvedValue(
      ["device_1"],
    );

    walletRepo.getKnownIps.mockResolvedValue([
      "102.0.0.1",
    ]);

    await expect(
      fraudDetectionUseCase.checkDeviceMismatch(
        {
          userId: "user_1",
          amount: 1000,
          deviceId: "unknown_device",
          ip: "102.0.0.1",
        },
      ),
    ).rejects.toThrow(
      "New device detected",
    );
  });

  // 🌍 NEW IP
  it("should detect new IP anomaly", async () => {
    walletRepo.getKnownDevices.mockResolvedValue(
      ["device_1"],
    );

    walletRepo.getKnownIps.mockResolvedValue([
      "102.0.0.1",
    ]);

    await expect(
      fraudDetectionUseCase.checkDeviceMismatch(
        {
          userId: "user_1",
          amount: 1000,
          deviceId: "device_1",
          ip: "200.10.10.10",
        },
      ),
    ).rejects.toThrow("New IP detected");
  });

  // 🔁 CIRCULAR TRANSFER
  it("should detect circular transfers", async () => {
    transactionRepo.findRecentTransfers.mockResolvedValue(
      [
        {
          from: "B",
          to: "A",
        },
      ],
    );

    await expect(
      fraudDetectionUseCase.checkCircularTransfer(
        {
          userId: "A",
          receiverId: "B",
          amount: 1000,
        },
      ),
    ).rejects.toThrow(
      "Circular transfer detected",
    );
  });

  // ✅ SAFE TRANSACTION
  it("should allow safe transaction", async () => {
    transactionRepo.countRecentByUser.mockResolvedValue(
      1,
    );

    transactionRepo.getUserAverageAmount.mockResolvedValue(
      5000,
    );

    transactionRepo.findRecentTransfers.mockResolvedValue(
      [],
    );

    walletRepo.getKnownDevices.mockResolvedValue(
      ["device_1"],
    );

    walletRepo.getKnownIps.mockResolvedValue([
      "102.0.0.1",
    ]);

    const result =
      await fraudDetectionUseCase.execute({
        userId: "user_1",
        amount: 1000,
        receiverId: "user_2",
        deviceId: "device_1",
        ip: "102.0.0.1",
      });

    expect(result).toEqual({
      status: "SAFE",
    });
  });

  // 🚨 COMBINED FRAUD SIGNALS
  it("should block transaction on combined fraud signals", async () => {
    transactionRepo.countRecentByUser.mockResolvedValue(
      20,
    );

    transactionRepo.getUserAverageAmount.mockResolvedValue(
      1000,
    );

    walletRepo.getKnownDevices.mockResolvedValue(
      ["device_1"],
    );

    walletRepo.getKnownIps.mockResolvedValue([
      "102.0.0.1",
    ]);

    await expect(
      fraudDetectionUseCase.execute({
        userId: "user_1",
        amount: 100000,
        deviceId: "new_device",
        ip: "500.1.1.1",
      }),
    ).rejects.toThrow();
  });

  // 🚨 VELOCITY SHOULD BLOCK EVALUATION
  it("should stop evaluation immediately on velocity fraud", async () => {
    transactionRepo.countRecentByUser.mockResolvedValue(
      50,
    );

    await expect(
      fraudDetectionUseCase.execute({
        userId: "user_1",
        amount: 1000,
      }),
    ).rejects.toThrow(
      "Velocity limit exceeded",
    );

    expect(
      transactionRepo.getUserAverageAmount,
    ).not.toHaveBeenCalled();
  });

  // 🚨 AMOUNT ANOMALY SHOULD BLOCK
  it("should stop evaluation on suspicious amount", async () => {
    transactionRepo.countRecentByUser.mockResolvedValue(
      1,
    );

    transactionRepo.getUserAverageAmount.mockResolvedValue(
      1000,
    );

    await expect(
      fraudDetectionUseCase.execute({
        userId: "user_1",
        amount: 500000,
      }),
    ).rejects.toThrow(
      "Suspicious amount detected",
    );
  });
});