import { BaseModule } from "./base.ts";
import { PlatformInfo } from "../config/schema.ts";
import { logger } from "../utils/logger.ts";
import { exec } from "../utils/shell.ts";

export class NetworkModule extends BaseModule {
  id = "network";
  name = "Network Tools";
  description = "Advanced networking and protocol analysis tools";

  async checkInstalled(platform: PlatformInfo): Promise<boolean> {
    return await exec(["which", "wireshark"]).then(r => r.success) ||
           await exec(["which", "tcpdump"]).then(r => r.success);
  }

  async install(platform: PlatformInfo, dryRun: boolean): Promise<boolean> {
    logger.info("Installing network tools...");

    const packages = [
      "wireshark", "tcpdump", "tshark", "netcat", "nmap",
      "iperf3", "mtr", "traceroute", "whois", "dig", "curl", "wget"
    ];

    if (platform.isMobile) {
      packages.push("termux-api");
    }

    if (dryRun) {
      logger.info(`Would install: ${packages.join(", ")}`);
      return true;
    }

    const pm = platform.packageManager;
    for (const pkg of packages) {
      try {
        if (platform.isMobile) {
          await exec([pm.name, "install", "-y", pkg]);
        } else {
          const cmd = pm.install.split(" ");
          cmd.push(pkg);
          if (pm.needsSudo) {
            await exec(["sudo", ...cmd]);
          } else {
            await exec(cmd);
          }
        }
        logger.success(`Installed ${pkg}`);
      } catch {
        logger.warn(`Could not install ${pkg}`);
      }
    }

    // Add user to wireshark group if needed
    if (!platform.isMobile) {
      const user = Deno.env.get("USER");
      if (user) {
        await exec(["sudo", "usermod", "-aG", "wireshark", user]);
        logger.info("Added user to wireshark group");
      }
    }

    logger.success("Network tools installation complete");
    return true;
  }

  async uninstall(platform: PlatformInfo): Promise<boolean> {
    logger.warn("Network tools uninstall not implemented");
    return true;
  }
}
