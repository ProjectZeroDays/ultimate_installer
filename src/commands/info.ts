import { Command } from "@cliffy/command";
import { detectPlatform } from "../core/platform.ts";
import { logger } from "../utils/logger.ts";

export const infoCommand = new Command()
  .description("Show detailed component information")
  .arguments("[component:string]")
  .action(async (component) => {
    const platform = await detectPlatform();

    if (!component) {
      // Show system info
      console.log("\n" + "=".repeat(60));
      console.log("SYSTEM INFORMATION");
      console.log("=".repeat(60));
      console.log(`OS:              ${platform.os}`);
      console.log(`Distribution:    ${platform.distribution.name}`);
      console.log(`Architecture:    ${platform.arch}`);
      console.log(`Package Manager: ${platform.packageManager.name}`);
      console.log(`Shell:           ${platform.shell}`);
      console.log(`Is Mobile:       ${platform.isMobile}`);
      console.log(`Is WSL:          ${platform.isWSL}`);
      console.log(`Is Container:    ${platform.isContainer}`);
      console.log("=".repeat(60) + "\n");
    } else {
      // Show component info
      logger.info(`Showing information for: ${component}`);
      // TODO: Implement component info lookup
    }
  });
