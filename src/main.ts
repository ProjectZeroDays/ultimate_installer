#!/usr/bin/env -S deno run --allow-all

import { Command, CompletionsCommand } from "@cliffy/command";
import { installCommand } from "./commands/install.ts";
import { uninstallCommand } from "./commands/uninstall.ts";
import { listCommand } from "./commands/list.ts";
import { updateCommand } from "./commands/update.ts";
import { searchCommand } from "./commands/search.ts";
import { infoCommand } from "./commands/info.ts";
import { doctorCommand } from "./commands/doctor.ts";
import { configCommand } from "./commands/config.ts";
import { VERSION } from "./version.ts";

await new Command()
  .name("ultimate-installer")
  .version(VERSION)
  .description("Project Zero Days Ultimate Installer - Universal Cross-Platform Development Environment Setup")
  .meta("author", "Project Zero Days")
  .meta("source", "https://github.com/ProjectZeroDays/ultimate_installer")
  .meta("license", "MIT")
  .meta("docs", "https://docs.projectzerodays.dev/ultimate-installer")

  .globalOption("-v, --verbose", "Enable verbose output")
  .globalOption("-q, --quiet", "Suppress non-error output")
  .globalOption("--no-color", "Disable colored output")
  .globalOption("--config <path:string>", "Use custom configuration file")

  .command("install", installCommand)
  .command("uninstall", uninstallCommand)
  .command("list", listCommand)
  .command("update", updateCommand)
  .command("search", searchCommand)
  .command("info", infoCommand)
  .command("doctor", doctorCommand)
  .command("config", configCommand)
  .command("completions", new CompletionsCommand())

  .command("help", new Command()
    .description("Show detailed help information")
    .action(() => {
      console.log(`
╔════════════════════════════════════════════════════════════════╗
║           ULTIMATE INSTALLER - UNIVERSAL SETUP TOOL            ║
╚════════════════════════════════════════════════════════════════╝

OVERVIEW:
  Ultimate Installer is a comprehensive cross-platform development
  environment setup tool supporting 50+ operating systems.

USAGE:
  ultimate-installer <command> [options]

COMMANDS:
  install [options]     Install components and tools
  uninstall [options]   Remove installed components  
  list [options]        List available components
  update [options]      Update package lists and tools
  search <query>        Search for available packages
  info [component]      Show detailed component information
  doctor [options]      Diagnose installation issues
  config [action]       Manage configuration
  completions [shell]   Generate shell completions
  version               Show version information
  help                  Show this help message

GLOBAL OPTIONS:
  -v, --verbose         Enable verbose output
  -q, --quiet           Suppress non-error output
  --no-color            Disable colored output
  --config <path>       Use custom configuration file

EXAMPLES:
  # Install all default components
  ultimate-installer install

  # Install specific module
  ultimate-installer install --module devtools

  # Install multiple modules
  ultimate-installer install --module core,devtools,security

  # Dry run (show what would be installed)
  ultimate-installer install --dry-run

  # Search for packages
  ultimate-installer search python

  # Check system health
  ultimate-installer doctor

SUPPORTED PLATFORMS:
  Linux: Ubuntu, Debian, Arch, Fedora, Kali, BlackArch, Parrot, etc.
  Mobile: Android (Termux), iOS (iSH)
  BSD: FreeBSD, OpenBSD, NetBSD
  Other: macOS, Windows, ChromeOS

For detailed documentation: https://docs.projectzerodays.dev
For support: https://github.com/ProjectZeroDays/ultimate_installer/issues
      `);
    })
  )

  .parse(Deno.args);
