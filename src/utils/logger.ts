// src/utils/logger.ts
import { join } from "https://deno.land/std@0.208.0/path/mod.ts";
import type { InstallLog, LogAction, LogError, OSDetails } from "../types/index.ts";

export class Logger {
  private logDir: string;
  private sessionId: string;
  private startTime: Date;
  private actions: LogAction[] = [];
  private errors: LogError[] = [];
  private os: OSDetails;

  constructor(os: OSDetails, baseDir: string) {
    this.os = os;
    this.sessionId = crypto.randomUUID().substring(0, 8);
    this.startTime = new Date();
    this.logDir = baseDir;
  }

  log(message: string, level: string = "INFO", category: string = "General"): void {
    const timestamp = new Date().toLocaleTimeString();
    const action: LogAction = {
      time: timestamp,
      level,
      category,
      message,
    };
    this.actions.push(action);

    // Console output with colors
    const colors: Record<string, string> = {
      INFO: "\x1b[37m",    // White
      SUCCESS: "\x1b[32m", // Green
      WARN: "\x1b[33m",    // Yellow
      ERROR: "\x1b[31m",   // Red
      DEBUG: "\x1b[90m",   // Gray
      CONFIG: "\x1b[35m",  // Magenta
      SEARCH: "\x1b[36m",  // Cyan
    };
    const reset = "\x1b[0m";
    const color = colors[level] || colors.INFO;
    
    console.log(`${color}[${timestamp}] [${level}] ${message}${reset}`);
  }

  error(app: string, error: string): void {
    const timestamp = new Date().toLocaleTimeString();
    this.errors.push({ app, error, time: timestamp });
    this.log(`Failed to install ${app}: ${error}`, "ERROR", "Install");
  }

  async save(): Promise<void> {
    const logFile = join(this.logDir, `Install_${this.formatDate(this.startTime)}_${this.sessionId}.log`);
    const jsonLog = join(this.logDir, `Session_${this.sessionId}.json`);

    const logData: InstallLog = {
      sessionId: this.sessionId,
      startTime: this.startTime.toISOString(),
      endTime: new Date().toISOString(),
      duration: this.formatDuration(new Date().getTime() - this.startTime.getTime()),
      os: this.os,
      actions: this.actions,
      errors: this.errors,
      settings: {},
    };

    // Save JSON log
    await Deno.writeTextFile(jsonLog, JSON.stringify(logData, null, 2));

    // Save text log
    const textLog = this.actions.map(a => `[${a.time}] [${a.level}] [${a.category}] ${a.message}`).join("\n");
    await Deno.writeTextFile(logFile, textLog);
  }

  private formatDate(date: Date): string {
    return date.toISOString().replace(/[:T]/g, "_").split(".")[0];
  }

  private formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  }

  getSessionId(): string {
    return this.sessionId;
  }
}
