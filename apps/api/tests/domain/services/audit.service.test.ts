import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuditService } from "../../src/services/audit.service";

let auditRepo: any;
let auditLogger: any;

let auditService: AuditService;

beforeEach(() => {
  auditRepo = {
    create: vi.fn(),
    findByUser: vi.fn(),
    findByAction: vi.fn(),
    getRecentLogs: vi.fn(),
  };

  auditLogger = {
    logAction: vi.fn(),
  };

  auditService = new AuditService(auditRepo, auditLogger);
});

describe("Audit Service", () => {
  // ✅ CREATE LOG
  it("should create audit log", async () => {
    auditRepo.create.mockResolvedValue({
      id: "audit_1",
    });

    const result = await auditService.log({
      userId: "user_1",
      action: "TRANSFER_CREATED",
      entityType: "TRANSACTION",
    });

    expect(auditRepo.create).toHaveBeenCalled();

    expect(result).toEqual({
      id: "audit_1",
    });
  });

  // ✅ DEFAULT SUCCESS STATUS
  it("should default status to SUCCESS", async () => {
    await auditService.log({
      action: "LOGIN",
      entityType: "AUTH",
    });

    expect(auditRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "SUCCESS",
      }),
    );
  });

  // ✅ FAILED ACTION
  it("should log failed actions", async () => {
    await auditService.log({
      action: "TRANSFER_FAILED",
      entityType: "TRANSACTION",
      status: "FAILED",
    });

    expect(auditRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "FAILED",
      }),
    );
  });

  // ✅ STORE METADATA
  it("should store metadata", async () => {
    await auditService.log({
      action: "TRANSFER_CREATED",
      entityType: "TRANSACTION",

      metadata: {
        amount: 5000,
      },
    });

    expect(auditRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: {
          amount: 5000,
        },
      }),
    );
  });

  // ✅ STORE IP ADDRESS
  it("should store ip address", async () => {
    await auditService.log({
      action: "LOGIN",
      entityType: "AUTH",
      ip: "192.168.0.1",
    });

    expect(auditRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        ip: "192.168.0.1",
      }),
    );
  });

  // ✅ STORE DEVICE ID
  it("should store device id", async () => {
    await auditService.log({
      action: "LOGIN",
      entityType: "AUTH",
      deviceId: "iphone_15",
    });

    expect(auditRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        deviceId: "iphone_15",
      }),
    );
  });

  // ✅ STORE USER AGENT
  it("should store user agent", async () => {
    await auditService.log({
      action: "LOGIN",
      entityType: "AUTH",
      userAgent: "Chrome",
    });

    expect(auditRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userAgent: "Chrome",
      }),
    );
  });

  // 🚨 SHOULD THROW ON DB FAILURE
  it("should throw if audit logging fails", async () => {
    auditRepo.create.mockRejectedValue(new Error("DB error"));

    await expect(
      auditService.log({
        action: "LOGIN",
        entityType: "AUTH",
      }),
    ).rejects.toThrow("DB error");
  });

  // 🚀 HIGH VOLUME LOGGING
  it("should handle high volume logging", async () => {
    auditRepo.create.mockResolvedValue(true);

    const logs = Array.from({ length: 100 }, (_, i) =>
      auditService.log({
        action: `ACTION_${i}`,
        entityType: "TEST",
      }),
    );

    await Promise.all(logs);

    expect(auditRepo.create).toHaveBeenCalledTimes(100);
  });

  // 🚨 CONCURRENT AUDIT SAFETY
  it("should safely process concurrent audit logs", async () => {
    auditRepo.create.mockResolvedValue(true);

    await Promise.all([
      auditService.log({
        action: "TRANSFER",
        entityType: "TX",
      }),

      auditService.log({
        action: "LOGIN",
        entityType: "AUTH",
      }),

      auditService.log({
        action: "WITHDRAWAL",
        entityType: "TX",
      }),
    ]);

    expect(auditRepo.create).toHaveBeenCalledTimes(3);
  });
});
