import { BaseModule } from "./base.ts";
import { PlatformInfo } from "../config/schema.ts";
import { logger } from "../utils/logger.ts";
import { exec } from "../utils/shell.ts";

export class ForensicsModule extends BaseModule {
  id = "forensics";
  name = "Digital Forensics";
  description = "Digital forensics and incident response tools";

  async checkInstalled(platform: PlatformInfo): Promise<boolean> {
    return await exec(["which", "sleuthkit"]).then(r => r.success) || 
           await exec(["which", "autopsy"]).then(r => r.success);
  }

  async install(platform: PlatformInfo, dryRun: boolean): Promise<boolean> {
    if (platform.isMobile) {
      logger.warn("Forensics tools not available on mobile platforms");
      return false;
    }

    logger.info("Installing forensics tools...");

    const packages = [
      "sleuthkit", "autopsy", "volatility3", "foremost", "scalpel",
      "binwalk", "exiftool", "pdf-parser", "oledump", "pcapfix"
    ];

    if (dryRun) {
      logger.info(`Would install: ${packages.join(", ")}`);
      return true;
    }

    const pm = platform.packageManager;
    for (const pkg of packages) {
      try {
        const cmd = pm.install.split(" ");
        cmd.push(pkg);
        if (pm.needsSudo) {
          await exec(["sudo", ...cmd]);
        } else {
          await exec(cmd);
        }
        logger.success(`Installed ${pkg}`);
      } catch {
        logger.warn(`Could not install ${pkg}`);
      }
    }

    logger.success("Forensics tools installation complete");
    return true;
  }

  async uninstall(platform: PlatformInfo): Promise<boolean> {
    logger.warn("Forensics tools uninstall not implemented");
    return true;
  }
}
