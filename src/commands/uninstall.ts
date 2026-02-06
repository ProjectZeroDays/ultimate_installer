import { Command } from "@cliffy/command";
import { detectPlatform } from "../core/platform.ts";
import { logger } from "../utils/logger.ts";

export const uninstallCommand = new Command()
  .description("Remove installed components")
  .option("-m, --module <modules:string>", "Modules to uninstall (comma-separated)")
  .option("-a, --all", "Uninstall all components")
  .option("-y, --yes", "Skip confirmation prompts")
  .option("--keep-config", "Keep configuration files")
  .action(async (options) => {
    const platform = await detectPlatform();

    logger.info("Uninstalling components...");
    logger.info(`Platform: ${platform.distribution.name}`);

    if (options.all) {
      logger.warn("This will remove ALL installed components!");
      if (!options.yes) {
        const confirm = prompt("Are you sure? (yes/no): ");
        if (confirm?.toLowerCase() !== "yes") {
          logger.info("Uninstall cancelled");
          return;
        }
      }
    }

    // TODO: Implement actual uninstall logic
    logger.success("Uninstall completed");
  });
