type LogLevel = "info" | "error" | "warn";

export class Logger {
  log(level: LogLevel, message: string, meta?: any) {
    const logEntry = {
      level,
      message,
      meta,
      timestamp: new Date().toISOString(),
    };

    console.log(JSON.stringify(logEntry));
  }

  info(message: string, meta?: any) {
    this.log("info", message, meta);
  }

  error(message: string, meta?: any) {
    this.log("error", message, meta);
  }

  warn(message: string, meta?: any) {
    this.log("warn", message, meta);
  }
}
