// src/utils/logger.ts
export type LogLevel = "debug" | "info" | "warn" | "error";

export class Logger {
  private prefix: string;
  private levelOrder: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };
  public level: LogLevel;

  constructor(prefix = "ultimate", level: LogLevel = "info") {
    this.prefix = prefix;
    this.level = level;
  }

  private shouldLog(level: LogLevel) {
    return this.levelOrder[level] >= this.levelOrder[this.level];
  }

  private timestamp() {
    return new Date().toISOString();
  }

  debug(...args: unknown[]) {
    if (!this.shouldLog("debug")) return;
    console.debug(`[${this.timestamp()}] [DEBUG] [${this.prefix}]`, ...args);
  }

  info(...args: unknown[]) {
    if (!this.shouldLog("info")) return;
    console.info(`[${this.timestamp()}] [INFO]  [${this.prefix}]`, ...args);
  }

  warn(...args: unknown[]) {
    if (!this.shouldLog("warn")) return;
    console.warn(`[${this.timestamp()}] [WARN]  [${this.prefix}]`, ...args);
  }

  error(...args: unknown[]) {
    if (!this.shouldLog("error")) return;
    console.error(`[${this.timestamp()}] [ERROR] [${this.prefix}]`, ...args);
  }

  child(prefixSuffix: string) {
    return new Logger(`${this.prefix}:${prefixSuffix}`, this.level);
  }

  setLevel(level: LogLevel) {
    this.level = level;
  }
}

/*
  Named export required by existing imports.
  Modules that do `import { logger } from "../utils/logger.ts";`
  will now receive this instance.
*/
export const logger = new Logger("ultimate", "info");

/* Optional convenience exports */
export const debug = (...args: unknown[]) => logger.debug(...args);
export const info = (...args: unknown[]) => logger.info(...args);
export const warn = (...args: unknown[]) => logger.warn(...args);
export const error = (...args: unknown[]) => logger.error(...args);
