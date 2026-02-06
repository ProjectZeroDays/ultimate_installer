import { Command } from "@cliffy/command";
import { Checkbox, Confirm } from "@cliffy/prompt";
import { detectPlatform } from "../core/platform.ts";
import { loadConfig } from "../config/loader.ts";
import { logger } from "../utils/logger.ts";
import { CoreModule } from "../modules/core.ts";
import { DevToolsModule } from "../modules/devtools.ts";
import { SecurityResearchModule } from "../modules/security_research.ts";
import { PrivacyModule } from "../modules/privacy.ts";
import { ForensicsModule } from "../modules/forensics.ts";
import { MobileDevModule } from "../modules/mobile_dev.ts";

const modules = {
  core: CoreModule,
  devtools: DevToolsModule,
  "security-research": SecurityResearchModule,
  privacy: PrivacyModule,
  forensics: ForensicsModule,
  "mobile-dev": MobileDevModule,
};

export const InstallCommand = new Command()
  .description("Install components")
  .arguments("[components...:string]")
  .option("-a, --all", "Install all components")
  .action(async ({ all, dryRun, yes }, ...args) => {
    const platform = detectPlatform();
    const config = await loadConfig();
    
    logger.info(`Ultimate Installer v${config.version}`);
    logger.info(`Platform: ${platform.distribution.name}`);

    let selected: string[] = [];
    
    if (all) {
      selected = config.components.map(c => c.id);
    } else if (args.length > 0) {
      selected = args;
    } else {
      // Interactive selection
      const choices = config.components.map(c => ({
        name: c.id,
        value: c.id,
        checked: c.default,
      }));
      
      selected = await Checkbox.prompt({
        message: "Select components to install",
        options: choices,
      });
    }

    if (selected.length === 0) {
      logger.warn("No components selected");
      return;
    }

    if (!yes && !dryRun) {
      const confirmed = await Confirm.prompt(`Install ${selected.join(", ")}?`);
      if (!confirmed) return;
    }

    // Install each component
    for (const id of selected) {
      const ModuleClass = modules[id as keyof typeof modules];
      if (!ModuleClass) {
        logger.warn(`Unknown component: ${id}`);
        continue;
      }
      
      const instance = new ModuleClass();
      await instance.install(platform, dryRun || false);
    }

    logger.success("Installation complete!");
  });