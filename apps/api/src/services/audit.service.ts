import type { PrismaAuditRepository } from "../domain/repositories/audit.repository.js";
import type { AuditLogger } from "../shared/logger/audit.logger.js";

export class AuditService {
  constructor(
    private auditRepo: PrismaAuditRepository,
    private auditLogger: AuditLogger,
  ) {}

  async log(data: {
    userId?: string;
    action: string;
    entityType: string;
    entityId?: string;
    metadata?: any;
    ip?: string;
    deviceId?: string;
    userAgent?: string;
    status?: string;
  }) {
    this.auditLogger.logAction({
      userId: data.userId || `Audit service - ${data.entityType}`,
      action: data.action,
      metadata: data.metadata,
    });
    return this.auditRepo.create({
      ...data,

      status: data.status ?? "SUCCESS",
    });
  }
}
