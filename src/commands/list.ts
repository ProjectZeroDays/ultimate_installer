import { Command, Table } from "@cliffy/command";
import { loadConfig } from "../config/loader.ts";
import { detectPlatform } from "../core/platform.ts";

export const ListCommand = new Command()
  .description("List available components")
  .action(async () => {
    const config = await loadConfig();
    const platform = detectPlatform();

    console.log("\nAvailable components:\n");

    const table = new Table()
      .header(["ID", "Name", "Description", "Default", "Supported"])
      .border(true);

    for (const component of config.components) {
      const supported = component.platforms.includes(platform.os) ? "✓" : "✗";
      table.push([
        component.id,
        component.name,
        component.description,
        component.default ? "Yes" : "No",
        supported,
      ]);
    }

    table.render();
    console.log(`\nPlatform: ${platform.distribution.name} (${platform.os})`);
  });