import { Logger } from "./logger.js";
export declare class AuditLogger extends Logger {
    logAction(data: {
        userId: string;
        action: string;
        metadata?: any;
    }): void;
}
//# sourceMappingURL=audit.logger.d.ts.map