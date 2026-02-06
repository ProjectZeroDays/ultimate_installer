import { PlatformInfo, PackageManager } from "../config/schema.ts";
import { logger } from "../utils/logger.ts";

export class PackageManagerHandler {
  private platform: PlatformInfo;
  private pm: PackageManager;

  constructor(platform: PlatformInfo) {
    this.platform = platform;
    this.pm = platform.packageManager;
  }

  async install(packages: string[]): Promise<boolean> {
    if (packages.length === 0) return true;

    logger.step(`Installing packages: ${packages.join(", ")}`);

    for (const pkg of packages) {
      const success = await this.installSingle(pkg);
      if (!success) {
        logger.error(`Failed to install ${pkg}`);
        // Continue with other packages but track failure
      }
    }

    return true;
  }

  private async installSingle(pkg: string): Promise<boolean> {
    const cmd = this.pm.install.split(" ");
    cmd.push(pkg);

    try {
      if (this.pm.needsSudo && !this.platform.isMobile) {
        const process = new Deno.Command("sudo", {
          args: cmd,
          stdout: "piped",
          stderr: "piped",
        });
        const { code } = await process.output();
        return code === 0;
      } else {
        const process = new Deno.Command(cmd[0], {
          args: cmd.slice(1),
          stdout: "piped",
          stderr: "piped",
        });
        const { code } = await process.output();
        return code === 0;
      }
    } catch (error) {
      logger.error(`Installation error: ${error}`);
      return false;
    }
  }

  async uninstall(packages: string[]): Promise<boolean> {
    for (const pkg of packages) {
      const cmd = this.pm.uninstall.split(" ");
      cmd.push(pkg);

      try {
        if (this.pm.needsSudo && !this.platform.isMobile) {
          await new Deno.Command("sudo", { args: cmd }).output();
        } else {
          await new Deno.Command(cmd[0], { args: cmd.slice(1) }).output();
        }
      } catch {
        // Ignore errors during uninstall
      }
    }
    return true;
  }

  async update(): Promise<void> {
    const cmd = this.pm.update.split(" ");
    if (this.pm.needsSudo && !this.platform.isMobile) {
      await new Deno.Command("sudo", { args: cmd }).output();
    } else {
      await new Deno.Command(cmd[0], { args: cmd.slice(1) }).output();
    }
  }

  async upgrade(): Promise<void> {
    const cmd = this.pm.upgrade.split(" ");
    if (this.pm.needsSudo && !this.platform.isMobile) {
      await new Deno.Command("sudo", { args: cmd }).output();
    } else {
      await new Deno.Command(cmd[0], { args: cmd.slice(1) }).output();
    }
  }

  async search(query: string): Promise<string[]> {
    const cmd = this.pm.search.split(" ");
    cmd.push(query);

    const process = new Deno.Command(cmd[0], {
      args: cmd.slice(1),
      stdout: "piped",
    });
    const { stdout } = await process.output();
    const output = new TextDecoder().decode(stdout);
    return output.split("\n").filter(line => line.trim());
  }

  async clean(): Promise<void> {
    const cmd = this.pm.clean.split(" ");
    if (this.pm.needsSudo && !this.platform.isMobile) {
      await new Deno.Command("sudo", { args: cmd }).output();
    } else {
      await new Deno.Command(cmd[0], { args: cmd.slice(1) }).output();
    }
  }
}