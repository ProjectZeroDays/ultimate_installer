import { BaseModule } from "./base.ts";
import { PlatformInfo } from "../config/schema.ts";
import { logger } from "../utils/logger.ts";
import { exec } from "../utils/shell.ts";

export class PrivacyModule extends BaseModule {
  id = "privacy";
  name = "Privacy Tools";
  description = "Anonymization, encryption, and privacy utilities";

  async checkInstalled(platform: PlatformInfo): Promise<boolean> {
    return await exec(["which", "gpg"]).then(r => r.success);
  }

  async install(platform: PlatformInfo, dryRun: boolean): Promise<boolean> {
    logger.info("Installing privacy tools...");

    const packages = this.getPackages(platform);

    if (dryRun) {
      logger.info(`Would install: ${packages.join(", ")}`);
      return true;
    }

    for (const pkg of packages) {
      await this.installPackage(platform, pkg);
    }

    await this.configurePrivacyTools(platform);

    logger.success("Privacy tools installed");
    return true;
  }

  private getPackages(platform: PlatformInfo): string[] {
    const common = ["gnupg", "tor", "torsocks", "proxychains-ng", "veracrypt"];

    if (platform.isMobile) {
      return ["gnupg", "tor"];
    }

    return [...common, "i2p", "freenet", "wireguard-tools", "openvpn"];
  }

  private async installPackage(platform: PlatformInfo, pkg: string): Promise<void> {
    const pm = platform.packageManager;
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
      logger.warn(`Failed to install ${pkg}`);
    }
  }

  private async configurePrivacyTools(platform: PlatformInfo): Promise<void> {
    logger.step("Configuring privacy tools...");

    // Configure Tor
    if (await exec(["which", "tor"]).then(r => r.success)) {
      logger.info("Tor installed successfully");
    }

    // Generate GPG key if not exists
    const gpgCheck = await exec(["gpg", "--list-secret-keys"]);
    if (!gpgCheck.success || !gpgCheck.output.includes("sec")) {
      logger.info("Consider generating a GPG key with: gpg --full-generate-key");
    }
  }

  async uninstall(platform: PlatformInfo): Promise<boolean> {
    logger.warn("Privacy tools uninstall not implemented");
    return true;
  }
}
