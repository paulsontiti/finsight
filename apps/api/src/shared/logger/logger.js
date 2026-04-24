export class Logger {
    log(level, message, meta) {
        const logEntry = {
            level,
            message,
            meta,
            timestamp: new Date().toISOString(),
        };
        console.log(JSON.stringify(logEntry));
    }
    info(message, meta) {
        this.log("info", message, meta);
    }
    error(message, meta) {
        this.log("error", message, meta);
    }
    warn(message, meta) {
        this.log("warn", message, meta);
    }
}
//# sourceMappingURL=logger.js.map