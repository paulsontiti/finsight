import { Logger } from "./logger.js";


export class AuditLogger extends Logger {
  logAction(data: {
    userId: string;
    action: string;
    metadata?: any;
  }) {
    this.info("Audit Log", data);
  }
}