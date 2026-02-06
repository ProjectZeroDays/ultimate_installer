import { Command } from "@cliffy/command";
import { detectPlatform } from "../core/platform.ts";
import { logger } from "../utils/logger.ts";
import { Table } from "@cliffy/table";

export const searchCommand = new Command()
  .description("Search for available packages and tools")
  .arguments("<query:string>")
  .option("-c, --category <category:string>", "Filter by category")
  .option("--installed", "Show only installed packages")
  .option("--available", "Show only available packages")
  .action(async (query, options) => {
    const platform = await detectPlatform();

    logger.info(`Searching for: ${query}`);
    logger.info(`Platform: ${platform.distribution.name}`);

    // Mock search results for demonstration
    const results = [
      { name: "git", version: "2.43.0", installed: true, category: "core" },
      { name: "nodejs", version: "20.10.0", installed: false, category: "devtools" },
      { name: "python3", version: "3.12.0", installed: true, category: "devtools" },
      { name: "nmap", version: "7.94", installed: false, category: "security" },
    ].filter(p => p.name.includes(query.toLowerCase()));

    if (results.length === 0) {
      logger.info("No packages found");
      return;
    }

    const table = new Table()
      .header(["Package", "Version", "Category", "Status"])
      .border(true);

    for (const pkg of results) {
      table.push([
        pkg.name,
        pkg.version,
        pkg.category,
        pkg.installed ? "✓ Installed" : "○ Available"
      ]);
    }

    console.log(table.toString());
  });
