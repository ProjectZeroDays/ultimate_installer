// src/utils/logger.ts
import { join } from "https://deno.land/std@0.208.0/path/mod.ts";
import { ensureDir } from "https://deno.land/std@0.208.0/fs/mod.ts";

export type LogLevel = "INFO" | "SUCCESS" | "WARN" | "ERROR" | "DEBUG" | "CONFIG" | "SEARCH";

export interface LogEntry {
  time: string;
  level: LogLevel;
  category: string;
  message: string;
}

export class Logger {
  private logDir: string;
  private sessionId: string;
  private startTime: Date;
  private actions: LogEntry[] = [];
  private errors: { app: string; error: string; time: string }[] = [];
  private os: Record<string, unknown>;

  private colors: Record<LogLevel, string> = {
    INFO: "\x1b[37m",    // White
    SUCCESS: "\x1b[32m", // Green
    WARN: "\x1b[33m",    // Yellow
    ERROR: "\x1b[31m",   // Red
    DEBUG: "\x1b[90m",   // Gray
    CONFIG: "\x1b[35m",  // Magenta
    SEARCH: "\x1b[36m",  // Cyan
  };
  private reset = "\x1b[0m";

  constructor(os: Record<string, unknown> = {}, baseDir?: string) {
    this.os = os;
    this.sessionId = crypto.randomUUID().substring(0, 8);
    this.startTime = new Date();
    
    // Determine log directory based on OS
    if (baseDir) {
      this.logDir = join(baseDir, "logs");
    } else if (Deno.build.os === "windows") {
      this.logDir = join(Deno.env.get("USERPROFILE") || ".", "Documents", "UltimateInstaller");
    } else if (Deno.build.os === "darwin") {
      this.logDir = join(Deno.env.get("HOME") || ".", "Library", "Application Support", "UltimateInstaller");
    } else {
      this.logDir = join(Deno.env.get("HOME") || ".", ".ultimate_installer");
    }
  }

  async initialize(): Promise<void> {
    await ensureDir(this.logDir);
  }

  log(message: string, level: LogLevel = "INFO", category: string = "General", noConsole: boolean = false): void {
    const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false });
    const entry: LogEntry = {
      time: timestamp,
      level,
      category,
      message,
    };
    this.actions.push(entry);

    if (!noConsole) {
      const color = this.colors[level] || this.colors.INFO;
      console.log(`${color}[${timestamp}] [${level}] ${message}${this.reset}`);
    }
  }

  success(message: string, category: string = "General"): void {
    this.log(message, "SUCCESS", category);
  }

  warn(message: string, category: string = "General"): void {
    this.log(message, "WARN", category);
  }

  error(app: string, errorMessage: string): void {
    const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false });
    this.errors.push({ app, error: errorMessage, time: timestamp });
    this.log(`Failed to install ${app}: ${errorMessage}`, "ERROR", "Install");
  }

  debug(message: string, category: string = "General"): void {
    this.log(message, "DEBUG", category, true); // No console by default
  }

  config(message: string, category: string = "General"): void {
    this.log(message, "CONFIG", category);
  }

  search(message: string, category: string = "General"): void {
    this.log(message, "SEARCH", category);
  }

  async save(): Promise<{ logFile: string; jsonLog: string }> {
    const dateStr = this.formatDate(this.startTime);
    const logFile = join(this.logDir, `Install_${dateStr}_${this.sessionId}.log`);
    const jsonLog = join(this.logDir, `Session_${this.sessionId}.json`);

    // Build log data
    const logData = {
      SessionId: this.sessionId,
      StartTime: this.startTime.toISOString(),
      EndTime: new Date().toISOString(),
      Duration: this.formatDuration(new Date().getTime() - this.startTime.getTime()),
      OS: this.os,
      Actions: this.actions,
      Errors: this.errors,
      Settings: {},
      Success: this.actions.filter(a => a.level === "SUCCESS").map(a => a.message),
      Failed: this.errors.map(e => e.app),
    };

    // Save JSON log
    await Deno.writeTextFile(jsonLog, JSON.stringify(logData, null, 2));

    // Save text log
    const textLog = this.actions.map(a => `[${a.time}] [${a.level}] [${a.category}] ${a.message}`).join("\n");
    await Deno.writeTextFile(logFile, textLog);

    return { logFile, jsonLog };
  }

  getLogDir(): string {
    return this.logDir;
  }

  getSessionId(): string {
    return this.sessionId;
  }

  getActions(): LogEntry[] {
    return [...this.actions];
  }

  getErrors(): { app: string; error: string; time: string }[] {
    return [...this.errors];
  }

  private formatDate(date: Date): string {
    return date.toISOString()
      .replace(/[:T]/g, "_")
      .split(".")[0];
  }

  private formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  }
}

// Global logger instance
let globalLogger: Logger | null = null;

export function createLogger(os?: Record<string, unknown>, baseDir?: string): Logger {
  globalLogger = new Logger(os, baseDir);
  return globalLogger;
}

export function getLogger(): Logger {
  if (!globalLogger) {
    throw new Error("Logger not initialized. Call createLogger() first.");
  }
  return globalLogger;
}

// Utility function to reset the global logger (useful for testing)
export function resetLogger(): void {
  globalLogger = null;
}

// Check if logger is initialized
export function isLoggerInitialized(): boolean {
  return globalLogger !== null;
}
