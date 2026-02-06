import { BaseModule } from "./base.ts";
import { PlatformInfo } from "../config/schema.ts";
import { logger } from "../utils/logger.ts";
import { exec } from "../utils/shell.ts";

export class MobileDevModule extends BaseModule {
  id = "mobile-dev";
  name = "Mobile Development Tools";
  description = "Development tools optimized for mobile environments (Termux/iSH)";

  async checkInstalled(platform: PlatformInfo): Promise<boolean> {
    if (!platform.isMobile) return true; // Skip on non-mobile
    return await exec(["which", "git"]).then(r => r.success);
  }

  async install(platform: PlatformInfo, dryRun: boolean): Promise<boolean> {
    if (!platform.isMobile) {
      logger.info("Skipping mobile-dev on non-mobile platform");
      return true;
    }

    logger.info(`Setting up mobile development environment on ${platform.distribution.name}...`);

    if (platform.distribution.id === "termux") {
      await this.setupTermux(platform, dryRun);
    } else if (platform.distribution.id === "ish") {
      await this.setupISH(platform, dryRun);
    }

    return true;
  }

  private async setupTermux(platform: PlatformInfo, dryRun: boolean): Promise<void> {
    const packages = [
      "git", "curl", "wget", "vim", "nano", "python", "nodejs", "ruby",
      "clang", "make", "cmake", "autoconf", "automake", "libtool",
      "pkg-config", "openssl", "openssh", "tmux", "zsh", "fish",
      "proot", "proot-distro", "termux-api", "termux-tools",
      "ffmpeg", "imagemagick", "sqlite", "postgresql", "redis",
      "nginx", "php", "composer", "golang", "rust", "kotlin",
      "gradle", "maven", "ant", "ndk-sysroot", "ndk-stl",
    ];

    // Storage setup
    if (!dryRun) {
      logger.step("Setting up storage access...");
      await exec(["termux-setup-storage"]);
      
      // Update packages
      logger.step("Updating package lists...");
      await exec(["pkg", "update"]);
      
      // Install packages
      for (const pkg of packages) {
        logger.step(`Installing ${pkg}...`);
        await exec(["pkg", "install", "-y", pkg]);
      }

      // Setup proot distros for full Linux experience
      logger.step("Setting up proot distributions...");
      await exec(["proot-distro", "install", "debian"]);
      await exec(["proot-distro", "install", "alpine"]);
      await exec(["proot-distro", "install", "archlinux"]);

      // Configure git
      await exec(["git", "config", "--global", "credential.helper", "store"]);
      
      // Setup SSH
      await exec(["mkdir", "-p", "~/.ssh"]);
      await exec(["chmod", "700", "~/.ssh"]);
      
      // Install useful scripts
      await this.installTermuxScripts(dryRun);
    } else {
      logger.info(`Would install: ${packages.join(", ")}`);
    }
  }

  private async setupISH(platform: PlatformInfo, dryRun: boolean): Promise<void> {
    // iSH uses Alpine Linux (i386 emulation)
    const packages = [
      "git", "curl", "wget", "vim", "nano", "python3", "py3-pip",
      "nodejs", "npm", "ruby", "build-base", "abuild", "binutils",
      "cmake", "autoconf", "automake", "libtool", "pkgconf",
      "openssl", "openssh", "tmux", "zsh", "fish",
      "ffmpeg", "imagemagick", "sqlite", "postgresql", "redis",
      "nginx", "php", "composer", "go", "rust", "cargo",
      "gradle", "maven", "openjdk11", "kotlin",
    ];

    if (!dryRun) {
      // Update and upgrade
      logger.step("Updating Alpine repositories...");
      await exec(["apk", "update"]);
      await exec(["apk", "upgrade"]);

      // Install packages
      for (const pkg of packages) {
        logger.step(`Installing ${pkg}...`);
        await exec(["apk", "add", pkg]);
      }

      // Setup SSH for remote access
      logger.step("Configuring SSH...");
      await exec(["ssh-keygen", "-A"]);
      await exec(["echo", "PermitRootLogin yes", ">>", "/etc/ssh/sshd_config"]);
      await exec(["passwd"]); // Set root password
      
      // Install Oh My Zsh
      await exec(["sh", "-c", "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"]);
      
      // Setup Python environment
      await exec(["pip3", "install", "--upgrade", "pip"]);
      await exec(["pip3", "install", "virtualenv", "ipython", "jupyter", "numpy", "pandas"]);
    } else {
      logger.info(`Would install: ${packages.join(", ")}`);
    }
  }

  private async installTermuxScripts(dryRun: boolean): Promise<void> {
    if (dryRun) return;

    const scripts = [
      {
        name: "termux-url-opener",
        content: `#!/data/data/com.termux/files/usr/bin/bash
# URL opener script for Termux
url="$1"
echo "Opening: $url"
case "$url" in
  *youtube.com/watch*|*youtu.be/*)
    yt-dlp "$url" ;;
  *github.com/*)
    git clone "$url" ;;
  *)
    curl -O "$url" ;;
esac`,
      },
      {
        name: "termux-file-editor",
        content: `#!/data/data/com.termux/files/usr/bin/bash
# File editor script
file="$1"
vim "$file"`,
      },
    ];

    const binDir = "/data/data/com.termux/files/home/.termux";
    await exec(["mkdir", "-p", binDir]);

    for (const script of scripts) {
      const path = `${binDir}/${script.name}`;
      await Deno.writeTextFile(path, script.content);
      await exec(["chmod", "+x", path]);
    }

    logger.success("Termux scripts installed");
  }

  async uninstall(platform: PlatformInfo): Promise<boolean> {
    logger.warn("Mobile development tools are not uninstalled to prevent system breakage");
    return true;
  }
}
