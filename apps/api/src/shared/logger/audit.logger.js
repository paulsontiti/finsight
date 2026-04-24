import { Logger } from "./logger.js";
export class AuditLogger extends Logger {
    logAction(data) {
        this.info("Audit Log", data);
    }
}
//# sourceMappingURL=audit.logger.js.map