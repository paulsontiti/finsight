import { PrismaClient } from "@prisma/client";
import type { Repository } from "../../shared/types/index.js";
import type { AuditLog } from "../../../generated/prisma/browser.js";
import type { JsonValue } from "@prisma/client/runtime/library";

export interface AuditInputProps {
  userId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: any;
  ip?: string;
  deviceId?: string;
  userAgent?: string;
  status?: string;
}

export class PrismaAuditRepository implements Repository<
  AuditInputProps,
  AuditLog
> {
  constructor(private prisma: PrismaClient) {}
  findById(id: string): Promise<AuditLog | null> {
    throw new Error("Method not implemented.");
  }

  async create(data: AuditInputProps) {
    return this.prisma.auditLog.create({
      data,
    });
  }

  async findByUser(userId: string) {
    return this.prisma.auditLog.findMany({
      where: {
        userId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findByAction(action: string) {
    return this.prisma.auditLog.findMany({
      where: {
        action,
      },
    });
  }

  async getRecentLogs(limit = 50) {
    return this.prisma.auditLog.findMany({
      take: limit,

      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
