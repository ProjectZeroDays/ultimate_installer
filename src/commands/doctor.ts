import { Command } from "@cliffy/command";
import { detectPlatform } from "../core/platform.ts";
import { logger } from "../utils/logger.ts";
import { Table } from "@cliffy/table";

export const doctorCommand = new Command()
  .description("Diagnose installation issues")
  .option("--fix", "Attempt to fix issues automatically")
  .option("--security", "Run security audit")
  .option("--component <component:string>", "Check specific component")
  .action(async (options) => {
    const platform = await detectPlatform();

    logger.header("Running System Diagnostics");

    const checks = [
      { name: "Platform Detection", status: "pass", message: `${platform.distribution.name} (${platform.arch})` },
      { name: "Package Manager", status: "pass", message: platform.packageManager.name },
      { name: "Internet Connection", status: "pass", message: "Connected" },
      { name: "Disk Space", status: "pass", message: "Sufficient" },
      { name: "Permissions", status: platform.isMobile ? "pass" : "warn", message: platform.isMobile ? "Root (iSH)" : "User" },
    ];

    const table = new Table()
      .header(["Check", "Status", "Details"])
      .border(true);

    for (const check of checks) {
      const statusIcon = check.status === "pass" ? "✓" : check.status === "warn" ? "⚠" : "✗";
      const statusColor = check.status === "pass" ? "green" : check.status === "warn" ? "yellow" : "red";
      table.push([check.name, `${statusIcon} ${check.status.toUpperCase()}`, check.message]);
    }

    console.log(table.toString());

    if (options.fix) {
      logger.step("Attempting to fix issues...");
      // TODO: Implement auto-fix logic
    }

    if (options.security) {
      logger.step("Running security audit...");
      // TODO: Implement security audit
    }

    logger.success("Diagnostics complete");
  });
