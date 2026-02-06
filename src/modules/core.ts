import { BaseModule } from "./base.ts";
import { PlatformInfo } from "../config/schema.ts";
import { logger } from "../utils/logger.ts";
import { PackageManagerHandler } from "../core/package_manager.ts";

export class CoreModule extends BaseModule {
  id = "core";
  name = "Core Tools";
  description = "Essential system tools and utilities";

  async checkInstalled(platform: PlatformInfo): Promise<boolean> {
    const tools = platform.isMobile 
      ? ["git", "curl"] 
      : ["git", "curl", "wget", "unzip"];
    
    for (const tool of tools) {
      const { success } = await this.exec(["which", tool]);
      if (!success) return false;
    }
    return true;
  }

  async install(platform: PlatformInfo, dryRun: boolean): Promise<boolean> {
    logger.info("Installing core tools...");
    
    const packages = this.getPackages(platform);
    
    if (dryRun) {
      logger.info(`Would install: ${packages.join(", ")}`);
      return true;
    }

    const pm = new PackageManagerHandler(platform);
    await pm.install(packages);

    // Configure git if installed
    if (await this.exists("/usr/bin/git") || await this.exists("/data/data/com.termux/files/usr/bin/git")) {
      await this.configureGit(platform);
    }

    logger.success("Core tools installed");
    return true;
  }

  private getPackages(platform: PlatformInfo): string[] {
    const base = ["git", "curl", "wget", "unzip", "tar", "vim", "nano"];
    
    if (platform.isMobile) {
      if (platform.distribution.id === "termux") {
        return [...base, "termux-api", "termux-tools", "tsu", "proot", "proot-distro"];
      }
      return base;
    }

    return [...base, "htop", "tmux", "zsh", "fish", "sudo", "software-properties-common"];
  }

  private async configureGit(platform: PlatformInfo): Promise<void> {
    logger.step("Configuring Git...");
    
    // Set default git config
    await this.exec(["git", "config", "--global", "init.defaultBranch", "main"]);
    await this.exec(["git", "config", "--global", "credential.helper", "cache"]);
    
    if (platform.isMobile) {
      await this.exec(["git", "config", "--global", "credential.helper", "store"]);
    }
  }

  async uninstall(platform: PlatformInfo): Promise<boolean> {
    logger.warn("Core tools are required for system operation. Skipping uninstall.");
    return true;
  }
}