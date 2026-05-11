import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { SaveUserSessionUseCase } from "../../src/application/use-cases/saveUserSession.usecase";

let userSessionRepo: any;

let saveUserSessionUseCase: SaveUserSessionUseCase;

beforeEach(() => {
  userSessionRepo = {
    findByUserDevice: vi.fn(),
    create: vi.fn(),
    updateLastActive: vi.fn(),
  };

  saveUserSessionUseCase =
    new SaveUserSessionUseCase(
      userSessionRepo,
    );
});

describe("SaveUserSessionUseCase", () => {
  // 🆕 CREATE NEW SESSION
  it("should create a new session for new device", async () => {
    userSessionRepo.findByUserDevice.mockResolvedValue(
      null,
    );

    userSessionRepo.create.mockResolvedValue({
      id: "session_1",
      userId: "user_1",
      deviceId: "device_1",
    });

    const result =
      await saveUserSessionUseCase.execute({
        userId: "user_1",
        deviceId: "device_1",
        ip: "102.0.0.1",
        userAgent: "Chrome",
      });

    expect(
      userSessionRepo.findByUserDevice,
    ).toHaveBeenCalledWith(
      "user_1",
      "device_1",
    );

    expect(
      userSessionRepo.create,
    ).toHaveBeenCalled();

    expect(result).toEqual({
      id: "session_1",
      userId: "user_1",
      deviceId: "device_1",
    });
  });

  // 🔄 UPDATE EXISTING SESSION
  it("should update last active for existing session", async () => {
    userSessionRepo.findByUserDevice.mockResolvedValue(
      {
        id: "existing_session",
        userId: "user_1",
        deviceId: "device_1",
      },
    );

    userSessionRepo.updateLastActive.mockResolvedValue(
      {
        id: "existing_session",
      },
    );

    const result =
      await saveUserSessionUseCase.execute({
        userId: "user_1",
        deviceId: "device_1",
        ip: "102.0.0.1",
        userAgent: "Chrome",
      });

    expect(
      userSessionRepo.updateLastActive,
    ).toHaveBeenCalledWith(
      "existing_session",
    );

    expect(result).toEqual({
      id: "existing_session",
    });
  });

  // 🚨 SHOULD FAIL IF CREATE SESSION FAILS
  it("should throw if session creation fails", async () => {
    userSessionRepo.findByUserDevice.mockResolvedValue(
      null,
    );

    userSessionRepo.create.mockRejectedValue(
      new Error("DB failure"),
    );

    await expect(
      saveUserSessionUseCase.execute({
        userId: "user_1",
        deviceId: "device_1",
        ip: "102.0.0.1",
      }),
    ).rejects.toThrow("DB failure");
  });

  // 🚨 SHOULD FAIL IF UPDATE LAST ACTIVE FAILS
  it("should throw if updating session fails", async () => {
    userSessionRepo.findByUserDevice.mockResolvedValue(
      {
        id: "existing_session",
      },
    );

    userSessionRepo.updateLastActive.mockRejectedValue(
      new Error("Update failed"),
    );

    await expect(
      saveUserSessionUseCase.execute({
        userId: "user_1",
        deviceId: "device_1",
        ip: "102.0.0.1",
      }),
    ).rejects.toThrow("Update failed");
  });

  // 🌍 SHOULD SAVE IP ADDRESS
  it("should save ip address correctly", async () => {
    userSessionRepo.findByUserDevice.mockResolvedValue(
      null,
    );

    userSessionRepo.create.mockResolvedValue({
      id: "session_1",
    });

    await saveUserSessionUseCase.execute({
      userId: "user_1",
      deviceId: "device_1",
      ip: "192.168.0.1",
    });

    expect(
      userSessionRepo.create,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        ip: "192.168.0.1",
      }),
    );
  });

  // 🖥 SHOULD SAVE USER AGENT
  it("should save user agent correctly", async () => {
    userSessionRepo.findByUserDevice.mockResolvedValue(
      null,
    );

    userSessionRepo.create.mockResolvedValue({
      id: "session_1",
    });

    await saveUserSessionUseCase.execute({
      userId: "user_1",
      deviceId: "device_1",
      ip: "192.168.0.1",
      userAgent: "Mozilla Chrome",
    });

    expect(
      userSessionRepo.create,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        userAgent: "Mozilla Chrome",
      }),
    );
  });

  // 🔁 SHOULD NOT CREATE DUPLICATE SESSIONS
  it("should not create duplicate sessions for same device", async () => {
    userSessionRepo.findByUserDevice.mockResolvedValue(
      {
        id: "existing_session",
      },
    );

    userSessionRepo.updateLastActive.mockResolvedValue(
      {
        id: "existing_session",
      },
    );

    await saveUserSessionUseCase.execute({
      userId: "user_1",
      deviceId: "device_1",
      ip: "192.168.0.1",
    });

    expect(
      userSessionRepo.create,
    ).not.toHaveBeenCalled();

    expect(
      userSessionRepo.updateLastActive,
    ).toHaveBeenCalled();
  });

  // 🚀 MULTIPLE DEVICES SHOULD CREATE NEW SESSIONS
  it("should create different sessions for different devices", async () => {
    userSessionRepo.findByUserDevice
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    userSessionRepo.create.mockResolvedValue({
      id: "session",
    });

    await saveUserSessionUseCase.execute({
      userId: "user_1",
      deviceId: "iphone",
      ip: "192.168.0.1",
    });

    await saveUserSessionUseCase.execute({
      userId: "user_1",
      deviceId: "macbook",
      ip: "192.168.0.2",
    });

    expect(
      userSessionRepo.create,
    ).toHaveBeenCalledTimes(2);
  });
});