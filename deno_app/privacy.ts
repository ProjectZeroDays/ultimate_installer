import { BaseModule } from "./base.ts";
import { PlatformInfo } from "../config/schema.ts";
import { logger } from "../utils/logger.ts";
import { exec } from "../utils/shell.ts";

export class PrivacyModule extends BaseModule {
  id = "privacy";
  name = "Privacy & Anonymity Tools";
  description = "VPN, Tor, DNS encryption, and anti-forensics tools";

  async checkInstalled(platform: PlatformInfo): Promise<boolean> {
    return await exec(["which", "tor"]).then(r => r.success);
  }

  async install(platform: PlatformInfo, dryRun: boolean): Promise<boolean> {
    logger.info(`Setting up privacy tools for ${platform.distribution.name}...`);

    const tools = this.getPrivacyTools(platform);

    if (dryRun) {
      logger.info(`Would install: ${tools.join(", ")}`);
      return true;
    }

    // Install tools
    for (const tool of tools) {
      await this.installPackage(platform, tool);
    }

    // Configure privacy settings
    await this.configurePrivacy(platform);

    return true;
  }

  private getPrivacyTools(platform: PlatformInfo): string[] {
    const base = ["tor", "torsocks", "proxychains-ng"];
    
    if (platform.isMobile) {
      if (platform.distribution.id === "termux") {
        return [...base, "obfs4proxy", "snowflake-client"];
      }
      return base;
    }

    const extended = [
      ...base,
      "dnscrypt-proxy",
      "stubby",
      "macchanger",
      "secure-delete",
      "bleachbit",
    ];

    if (platform.distribution.isPrivacyFocused) {
      // Kodachi/Parrot/Tails specific
      extended.push("kodachi-dashboard", "anonsurf", "firejail");
    }

    return extended;
  }

  private async configurePrivacy(platform: PlatformInfo): Promise<void> {
    logger.step("Configuring privacy settings...");

    // Tor configuration
    const torrc = platform.isMobile 
      ? "/data/data/com.termux/files/usr/etc/tor/torrc"
      : "/etc/tor/torrc";

    const torConfig = `
# Ultimate Installer Tor Configuration
SocksPort 9050
ControlPort 9051
CookieAuthentication 1
MaxCircuitDirtiness 10
UseEntryGuards 1
NumEntryGuards 8
`;

    if (platform.isMobile) {
      await Deno.writeTextFile(torrc, torConfig);
    } else {
      await exec(["sudo", "tee", torrc], { input: torConfig });
    }

    // DNS over HTTPS configuration
    if (!platform.isMobile) {
      await this.setupDNSOverHTTPS(platform);
    }

    // MAC address randomization
    await this.setupMACRandomization(platform);

    logger.success("Privacy tools configured");
  }

  private async setupDNSOverHTTPS(platform: PlatformInfo): Promise<void> {
    const stubbyConfig = `
resolution_type: GETDNS_RESOLUTION_STUB
dns_transport_list:
  - GETDNS_TRANSPORT_TLS
tls_authentication: GETDNS_AUTHENTICATION_REQUIRED
tls_query_padding_blocksize: 256
edns_client_subnet_private: 1
round_robin_upstreams: 1
idle_timeout: 10000
listen_addresses:
  - 127.0.0.1@53000
  - 0::1@53000
upstream_recursive_servers:
  - address_data: 1.1.1.1
    tls_auth_name: "cloudflare-dns.com"
  - address_data: 8.8.8.8
    tls_auth_name: "dns.google"
`;

    await exec(["sudo", "tee", "/etc/stubby/stubby.yml"], { input: stubbyConfig });
    await exec(["sudo", "systemctl", "enable", "stubby"]);
    await exec(["sudo", "systemctl", "start", "stubby"]);
  }

  private async setupMACRandomization(platform: PlatformInfo): Promise<void> {
    if (platform.isMobile) return;

    const script = `#!/bin/bash
# MAC Address Randomization Script
interface=$1
if [ -z "$interface" ]; then
  interface=$(ip link | grep -E "^[0-9]+: (wlan|eth)" | head -1 | cut -d: -f2 | tr -d ' ')
fi
sudo ip link set dev $interface down
sudo macchanger -r $interface
sudo ip link set dev $interface up
`;

    await exec(["sudo", "tee", "/usr/local/bin/randomize-mac"], { input: script });
    await exec(["sudo", "chmod", "+x", "/usr/local/bin/randomize-mac"]);

    // Add to cron for periodic randomization
    await exec(["sudo", "bash", "-c", "echo '0 * * * * root /usr/local/bin/randomize-mac' > /etc/cron.d/mac-randomizer"]);
  }

  private async installPackage(platform: PlatformInfo, pkg: string): Promise<void> {
    const pm = platform.packageManager;
    const cmd = pm.install.split(" ");
    cmd.push(pkg);
    
    if (pm.needsSudo && !platform.isMobile) {
      await exec(["sudo", ...cmd]);
    } else {
      await exec(cmd);
    }
  }

  async uninstall(platform: PlatformInfo): Promise<boolean> {
    return true;
  }
}
