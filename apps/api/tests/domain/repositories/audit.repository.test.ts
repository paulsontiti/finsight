import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { PrismaAuditRepository } from "../../../src/domain/repositories/audit.repository"

describe("PrismaAuditRepository", () => {
  let prisma: any;

  let repository: PrismaAuditRepository;

  beforeEach(() => {
    prisma = {
      auditLog: {
        create: vi.fn(),
        findMany: vi.fn(),
      },
    };

    repository =
      new PrismaAuditRepository(prisma);
  });

  // ✅ CREATE AUDIT LOG
  it("should create audit log", async () => {
    prisma.auditLog.create.mockResolvedValue({
      id: "audit_1",
    });

    const result =
      await repository.create({
        userId: "user_1",
        action: "LOGIN",
        entityType: "AUTH",
      });

    expect(
      prisma.auditLog.create,
    ).toHaveBeenCalledWith({
      data: {
        userId: "user_1",
        action: "LOGIN",
        entityType: "AUTH",
      },
    });

    expect(result).toEqual({
      id: "audit_1",
    });
  });

  // ✅ FIND USER LOGS
  it("should find logs by user", async () => {
    prisma.auditLog.findMany.mockResolvedValue(
      [],
    );

    await repository.findByUser("user_1");

    expect(
      prisma.auditLog.findMany,
    ).toHaveBeenCalledWith({
      where: {
        userId: "user_1",
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  });

  // ✅ FIND BY ACTION
  it("should find logs by action", async () => {
    prisma.auditLog.findMany.mockResolvedValue(
      [],
    );

    await repository.findByAction(
      "TRANSFER_CREATED",
    );

    expect(
      prisma.auditLog.findMany,
    ).toHaveBeenCalledWith({
      where: {
        action: "TRANSFER_CREATED",
      },
    });
  });

  // ✅ GET RECENT LOGS
  it("should get recent logs", async () => {
    prisma.auditLog.findMany.mockResolvedValue(
      [],
    );

    await repository.getRecentLogs();

    expect(
      prisma.auditLog.findMany,
    ).toHaveBeenCalledWith({
      take: 50,

      orderBy: {
        createdAt: "desc",
      },
    });
  });

  // ✅ CUSTOM LIMIT
  it("should support custom recent log limit", async () => {
    prisma.auditLog.findMany.mockResolvedValue(
      [],
    );

    await repository.getRecentLogs(10);

    expect(
      prisma.auditLog.findMany,
    ).toHaveBeenCalledWith({
      take: 10,

      orderBy: {
        createdAt: "desc",
      },
    });
  });

  // 🚨 DB FAILURE
  it("should throw on database failure", async () => {
    prisma.auditLog.create.mockRejectedValue(
      new Error("DB failure"),
    );

    await expect(
      repository.create({
        action: "LOGIN",
        entityType: "AUTH",
      }),
    ).rejects.toThrow("DB failure");
  });
});