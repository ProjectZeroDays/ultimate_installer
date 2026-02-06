import { Command } from "@cliffy/command";
import { detectPlatform } from "../core/platform.ts";
import { PackageManagerHandler } from "../core/package_manager.ts";
import { logger } from "../utils/logger.ts";

export const UpdateCommand = new Command()
  .description("Update package lists and upgrade installed packages")
  .action(async () => {
    const platform = detectPlatform();
    const pm = new PackageManagerHandler(platform);
    
    logger.info("Updating package lists...");
    await pm.update();
    
    logger.info("Upgrading packages...");
    await pm.upgrade();
    
    logger.success("System updated");
  });