import { BaseModule } from "./base.ts";
import { PlatformInfo } from "../config/schema.ts";
import { logger } from "../utils/logger.ts";
import { exec } from "../utils/shell.ts";

export class EmbeddedModule extends BaseModule {
  id = "embedded";
  name = "Embedded Development";
  description = "IoT and embedded systems development tools";

  async checkInstalled(platform: PlatformInfo): Promise<boolean> {
    return await exec(["which", "platformio"]).then(r => r.success) ||
           await exec(["which", "arduino-cli"]).then(r => r.success);
  }

  async install(platform: PlatformInfo, dryRun: boolean): Promise<boolean> {
    if (platform.isMobile) {
      logger.warn("Embedded development tools not available on mobile");
      return false;
    }

    logger.info("Installing embedded development tools...");

    const packages = [
      "platformio", "arduino-cli", "avrdude", "esptool", "openocd",
      "gdb-multiarch", "minicom", "picocom", "mosquitto", "nodejs"
    ];

    if (dryRun) {
      logger.info(`Would install: ${packages.join(", ")}`);
      return true;
    }

    // Install PlatformIO via pip
    await exec(["pip3", "install", "-U", "platformio"]);

    // Install Arduino CLI
    await exec(["curl", "-fsSL", "https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh", "|", "sh"]);

    const pm = platform.packageManager;
    for (const pkg of packages) {
      if (pkg === "platformio" || pkg === "arduino-cli") continue;
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

    logger.success("Embedded tools installation complete");
    return true;
  }

  async uninstall(platform: PlatformInfo): Promise<boolean> {
    logger.warn("Embedded tools uninstall not implemented");
    return true;
  }
}
