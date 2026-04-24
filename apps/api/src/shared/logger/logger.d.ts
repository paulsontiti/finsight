type LogLevel = "info" | "error" | "warn";
export declare class Logger {
    log(level: LogLevel, message: string, meta?: any): void;
    info(message: string, meta?: any): void;
    error(message: string, meta?: any): void;
    warn(message: string, meta?: any): void;
}
export {};
//# sourceMappingURL=logger.d.ts.map