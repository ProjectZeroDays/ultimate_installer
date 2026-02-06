import { PlatformInfo, Component } from "../config/schema.ts";
import { logger } from "../utils/logger.ts";
import { loadConfig } from "../config/loader.ts";
import { detectPlatform } from "./platform.ts";

export class CoreInstaller {
  private platform: PlatformInfo;
  private config: Awaited<ReturnType<typeof loadConfig>>;

  constructor(platform: PlatformInfo, config: Awaited<ReturnType<typeof loadConfig>>) {
    this.platform = platform;
    this.config = config;
  }

  async initialize(): Promise<void> {
    logger.info("Initializing Ultimate Installer...");
    
    // Create necessary directories
    const paths = this.platform.paths;
    await Deno.mkdir(paths.installDir, { recursive: true });
    await Deno.mkdir(paths.configDir, { recursive: true });
    await Deno.mkdir(paths.cacheDir, { recursive: true });

    // Save configuration
    await this.saveConfig();

    logger.success("Initialization complete");
  }

  private async saveConfig(): Promise<void> {
    const configPath = `${this.platform.paths.configDir}/config.json`;
    const data = {
      version: this.config.version,
      platform: this.platform.os,
      distribution: this.platform.distribution.id,
      installDate: new Date().toISOString(),
    };
    await Deno.writeTextFile(configPath, JSON.stringify(data, null, 2));
  }

  async installComponent(componentId: string, dryRun: boolean): Promise<boolean> {
    const component = this.config.components.find(c => c.id === componentId);
    if (!component) {
      logger.error(`Component not found: ${componentId}`);
      return false;
    }

    if (!component.platforms.includes(this.platform.os)) {
      logger.warn(`Component ${componentId} not supported on ${this.platform.os}`);
      return false;
    }

    logger.step(`Installing ${component.name}...`);
    
    if (dryRun) {
      logger.info(`[DRY RUN