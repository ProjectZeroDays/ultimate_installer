#!/usr/bin/env -S deno run --allow-all

import { Command } from "@cliffy/command";
import { CompletionsCommand } from "@cliffy/command/completions";
import { InstallCommand } from "./commands/install.ts";
import { ListCommand } from "./commands/list.ts";
import { UninstallCommand } from "./commands/uninstall.ts";
import { UpdateCommand } from "./commands/update.ts";
import { detectPlatform } from "./core/platform.ts";
import { loadConfig } from "./config/loader.ts";
import { logger } from "./utils/logger.ts";

// Detect platform at startup for global context
const platform = await detectPlatform();
const config = await loadConfig();

await new Command()
  .name("ultimate-installer")
  .version(config.version)
  .description(`${config.description}
  
  Platform: ${platform.distribution.name} (${platform.os}-${platform.arch})
  Package Manager: ${platform.packageManager.name}
  ${platform.isMobile ? "Mobile Environment Detected" : ""}
  ${platform.isSecurityFocused ? "Security-Focused Distribution" : ""}
  ${platform.isPrivacyFocused ? "Privacy-Focused Distribution" : ""}
  `)
  
  .globalOption("-v, --verbose", "Enable verbose output", { 
    action: () => logger.setVerbose(true) 
  })
  .globalOption("-d, --dry-run", "Show what would be installed without making changes")
  .globalOption("-y, --yes", "Auto-confirm all prompts")
  .globalOption("--mobile-only", "Only install mobile-compatible tools", {
    depends: ["platform.isMobile"],
  })

  .command("install", InstallCommand)
  .command("i", InstallCommand)
  
  .command("list", ListCommand)
  .command("ls", ListCommand)
  
  .command("uninstall", UninstallCommand)
  .command("remove", UninstallCommand)
  .command("rm", UninstallCommand)
  
  .command("update", UpdateCommand)
  .command("upgrade", UpdateCommand)
  
  .command("completions", new CompletionsCommand())
  
  .parse(Deno.args);
