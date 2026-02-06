import { BaseModule } from "./base.ts";
import { PlatformInfo, Distribution } from "../config/schema.ts";
import { logger } from "../utils/logger.ts";
import { exec } from "../utils/shell.ts";

// Security tools organized by category and distribution availability
const SECURITY_TOOLS: Record<string, Record<Distribution, string[]>> = {
  network_scanning: {
    termux: ["nmap", "masscan"],
    ish: ["nmap"],
    alpine: ["nmap"],
    arch: ["nmap", "masscan", "zmap", "unicornscan"],
    blackarch: ["nmap", "masscan", "zmap", "unicornscan", "rustscan", "naabu"],
    manjaro: ["nmap", "masscan"],
    debian: ["nmap", "masscan"],
    ubuntu: ["nmap", "masscan"],
    mint: ["nmap", "masscan"],
    elementary: ["nmap"],
    kodachi: ["nmap", "masscan", "zmap"],
    parrot: ["nmap", "masscan", "zmap", "rustscan"],
    fedora: ["nmap", "masscan"],
    centos: ["nmap"],
    rhel: ["nmap"],
    rocky: ["nmap"],
    alma: ["nmap"],
    freebsd: ["nmap"],
    openbsd: ["nmap"],
    netbsd: ["nmap"],
    generic: ["nmap"],
  },
  vulnerability_scanning: {
    termux: ["nikto"],
    ish: [],
    alpine: ["nikto"],
    arch: ["nikto", "openvas"],
    blackarch: ["nikto", "openvas", "nessus", "nexpose"],
    manjaro: ["nikto"],
    debian: ["nikto", "openvas-scanner"],
    ubuntu: ["nikto", "openvas-scanner"],
    mint: ["nikto"],
    elementary: ["nikto"],
    kodachi: ["nikto", "openvas"],
    parrot: ["nikto", "openvas", "gvm"],
    fedora: ["nikto"],
    centos: ["nikto"],
    rhel: ["nikto"],
    rocky: ["nikto"],
    alma: ["nikto"],
    freebsd: ["nikto"],
    openbsd: ["nikto"],
    netbsd: [],
    generic: ["nikto"],
  },
  wireless_security: {
    termux: ["aircrack-ng", "wireshark-gtk"],
    ish: [],
    alpine: ["aircrack-ng", "wireshark"],
    arch: ["aircrack-ng", "wireshark-cli", "wireshark-qt", "kismet", "wifite"],
    blackarch: ["aircrack-ng", "wireshark-cli", "wireshark-qt", "kismet", "wifite", "fern-wifi-cracker", "pixiewps"],
    manjaro: ["aircrack-ng", "wireshark-cli"],
    debian: ["aircrack-ng", "wireshark"],
    ubuntu: ["aircrack-ng", "wireshark"],
    mint: ["aircrack-ng", "wireshark"],
    elementary: ["aircrack-ng"],
    kodachi: ["aircrack-ng", "wireshark", "kismet", "wifite", "reaver"],
    parrot: ["aircrack-ng", "wireshark", "kismet", "wifite", "fern-wifi-cracker"],
    fedora: ["aircrack-ng", "wireshark-cli"],
    centos: ["aircrack-ng"],
    rhel: ["aircrack-ng"],
    rocky: ["aircrack-ng"],
    alma: ["aircrack-ng"],
    freebsd: ["aircrack-ng"],
    openbsd: [],
    netbsd: [],
    generic: ["aircrack-ng"],
  },
  forensics: {
    termux: ["sleuthkit", "autopsy"],
    ish: ["sleuthkit"],
    alpine: ["sleuthkit"],
    arch: ["sleuthkit", "autopsy", "volatility3", "bulk-extractor"],
    blackarch: ["sleuthkit", "autopsy", "volatility3", "bulk-extractor", "dff", "dff-gui"],
    manjaro: ["sleuthkit"],
    debian: ["sleuthkit", "autopsy"],
    ubuntu: ["sleuthkit", "autopsy"],
    mint: ["sleuthkit"],
    elementary: ["sleuthkit"],
    kodachi: ["sleuthkit", "autopsy", "volatility"],
    parrot: ["sleuthkit", "autopsy", "volatility3", "bulk-extractor"],
    fedora: ["sleuthkit"],
    centos: ["sleuthkit"],
    rhel: ["sleuthkit"],
    rocky: ["sleuthkit"],
    alma: ["sleuthkit"],
    freebsd: ["sleuthkit"],
    openbsd: ["sleuthkit"],
    netbsd: ["sleuthkit"],
    generic: ["sleuthkit"],
  },
  reverse_engineering: {
    termux: ["radare2"],
    ish: ["radare2"],
    alpine: ["radare2"],
    arch: ["radare2", "ghidra", "binaryninja", "ida-free"],
    blackarch: ["radare2", "ghidra", "binaryninja", "ida-free", "cutter", "rizin"],
    manjaro: ["radare2", "ghidra"],
    debian: ["radare2", "ghidra"],
    ubuntu: ["radare2", "ghidra"],
    mint: ["radare2"],
    elementary: ["radare2"],
    kodachi: ["radare2", "ghidra"],
    parrot: ["radare2", "ghidra", "cutter"],
    fedora: ["radare2", "ghidra"],
    centos: ["radare2"],
    rhel: ["radare2"],
    rocky: ["radare2"],
    alma: ["radare2"],
    freebsd: ["radare2"],
    openbsd: ["radare2"],
    netbsd: ["radare2"],
    generic: ["radare2"],
  },
  exploitation: {
    termux: ["metasploit-framework"],
    ish: [],
    alpine: [],
    arch: ["metasploit", "exploitdb", "beef"],
    blackarch: ["metasploit", "exploitdb", "beef", "set", "routersploit", "commix"],
    manjaro: ["metasploit"],
    debian: ["exploitdb"],
    ubuntu: ["exploitdb"],
    mint: ["exploitdb"],
    elementary: ["exploitdb"],
    kodachi: ["metasploit", "exploitdb"],
    parrot: ["metasploit", "exploitdb", "beef", "set"],
    fedora: ["exploitdb"],
    centos: ["exploitdb"],
    rhel: ["exploitdb"],
    rocky: ["exploitdb"],
    alma: ["exploitdb"],
    freebsd: [],
    openbsd: [],
    netbsd: [],
    generic: ["exploitdb"],
  },
  osint: {
    termux: ["theharvester", "maltego"],
    ish: ["theharvester"],
    alpine: ["theharvester"],
    arch: ["theharvester", "maltego", "spiderfoot", "recon-ng"],
    blackarch: ["theharvester", "maltego", "spiderfoot", "recon-ng", "osrframework", "tinfoleak"],
    manjaro: ["theharvester"],
    debian: ["theharvester"],
    ubuntu: ["theharvester", "maltego"],
    mint: ["theharvester"],
    elementary: ["theharvester"],
    kodachi: ["theharvester", "maltego", "spiderfoot"],
    parrot: ["theharvester", "maltego", "spiderfoot", "recon-ng"],
    fedora: ["theharvester"],
    centos: ["theharvester"],
    rhel: ["theharvester"],
    rocky: ["theharvester"],
    alma: ["theharvester"],
    freebsd: ["theharvester"],
    openbsd: ["theharvester"],
    netbsd: ["theharvester"],
    generic: ["theharvester"],
  },
};

export class SecurityResearchModule extends BaseModule {
  id = "security-research";
  name = "Security Research Tools";
  description = "Comprehensive security testing and research toolkit";

  async checkInstalled(platform: PlatformInfo): Promise<boolean> {
    return await exec(["which", "nmap"]).then(r => r.success);
  }

  async install(platform: PlatformInfo, dryRun: boolean): Promise<boolean> {
    const dist = platform.distribution.id;
    logger.info(`Installing security research tools for ${platform.distribution.name}...`);

    // Install by category
    for (const [category, tools] of Object.entries(SECURITY_TOOLS)) {
      const availableTools = tools[dist] || tools.generic;
      
      if (availableTools.length === 0) {
        logger.warn(`No ${category} tools available for ${dist}`);
        continue;
      }

      logger.step(`Installing ${category} tools: ${availableTools.join(", ")}`);

      if (!dryRun) {
        // Update package lists first
        await this.updatePackageLists(platform);

        for (const tool of availableTools) {
          await this.installTool(platform, tool);
        }
      }
    }

    // Post-installation configuration
    if (!dryRun) {
      await this.configureTools(platform);
    }

    return true;
  }

  private async updatePackageLists(platform: PlatformInfo): Promise<void> {
    const pm = platform.packageManager;
    
    if (platform.distribution.id === "blackarch") {
      // Setup BlackArch repository if not already done
      await exec(["curl", "-O", "https://blackarch.org/strap.sh"]);
      await exec(["chmod", "+x", "strap.sh"]);
      await exec(["sudo", "./strap.sh"]);
    }

    await exec(pm.update.split(" "));
  }

  private async installTool(platform: PlatformInfo, tool: string): Promise<void> {
    const pm = platform.packageManager;
    
    try {
      if (platform.isMobile) {
        // Mobile-specific handling
        if (platform.distribution.id === "termux") {
          await exec(["pkg", "install", "-y", tool]);
        } else if (platform.distribution.id === "ish") {
          await exec(["apk", "add", tool]);
        }
      } else {
        const cmd = pm.install.split(" ");
        cmd.push(tool);
        if (pm.needsSudo) {
          await exec(["sudo", ...cmd]);
        } else {
          await exec(cmd);
        }
      }
      logger.success(`Installed ${tool}`);
    } catch (error) {
      logger.error(`Failed to install ${tool}: ${error}`);
    }
  }

  private async configureTools(platform: PlatformInfo): Promise<void> {
    logger.step("Configuring security tools...");

    // Setup Metasploit database if installed
    if (await exec(["which", "msfdb"]).then(r => r.success)) {
      await exec(["msfdb", "init"]);
    }

    // Update ExploitDB
    if (await exec(["which", "searchsploit"]).then(r => r.success)) {
      await exec(["searchsploit", "--update"]);
    }

    // Setup Wireshark permissions (non-root capture)
    if (platform.distribution.family !== "mobile") {
      await exec(["sudo", "usermod", "-aG", "wireshark", Deno.env.get("USER") || ""]);
      await exec(["sudo", "setcap", "cap_net_raw,cap_net_admin=eip", "/usr/bin/dumpcap"]);
    }

    // Configure Nmap scripts
    await exec(["sudo", "nmap", "--script-updatedb"]);

    logger.success("Security tools configured");
  }

  async uninstall(platform: PlatformInfo): Promise<boolean> {
    logger.warn("Uninstalling security tools...");
    // Implementation would reverse the installation
    return true;
  }
}