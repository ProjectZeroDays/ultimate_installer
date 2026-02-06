import { 
  Platform, 
  Distribution, 
  DistributionConfig, 
  PlatformInfo,
  MobileConfig,
  PackageManager 
} from "../config/schema.ts";
import { join } from "@std/path";
import { exec } from "../utils/shell.ts";

const DISTRIBUTIONS: Record<Distribution, DistributionConfig> = {
  termux: {
    id: "termux",
    name: "Termux (Android)",
    family: "mobile",
    packageManager: "pkg",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    defaultRepos: ["https://packages.termux.dev/apt/termux-main"],
  },
  ish: {
    id: "ish",
    name: "iSH (iOS)",
    family: "alpine",
    packageManager: "apk",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    defaultRepos: [
      "https://dl-cdn.alpinelinux.org/alpine/edge/main",
      "https://dl-cdn.alpinelinux.org/alpine/edge/community",
    ],
  },
  alpine: {
    id: "alpine",
    name: "Alpine Linux",
    family: "alpine",
    packageManager: "apk",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    defaultRepos: [
      "https://dl-cdn.alpinelinux.org/alpine/latest-stable/main",
      "https://dl-cdn.alpinelinux.org/alpine/latest-stable/community",
    ],
  },
  arch: {
    id: "arch",
    name: "Arch Linux",
    family: "arch",
    packageManager: "pacman",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    defaultRepos: [],
  },
  blackarch: {
    id: "blackarch",
    name: "BlackArch Linux",
    family: "arch",
    packageManager: "pacman",
    isSecurityFocused: true,
    isPrivacyFocused: false,
    defaultRepos: ["https://blackarch.org/blackarch/blackarch/os/x86_64"],
  },
  manjaro: {
    id: "manjaro",
    name: "Manjaro",
    family: "arch",
    packageManager: "pacman",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    defaultRepos: [],
  },
  debian: {
    id: "debian",
    name: "Debian",
    family: "debian",
    packageManager: "apt",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    defaultRepos: [],
  },
  ubuntu: {
    id: "ubuntu",
    name: "Ubuntu",
    family: "debian",
    packageManager: "apt",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    defaultRepos: [],
  },
  mint: {
    id: "mint",
    name: "Linux Mint",
    family: "debian",
    packageManager: "apt",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    defaultRepos: [],
  },
  elementary: {
    id: "elementary",
    name: "Elementary OS",
    family: "debian",
    packageManager: "apt",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    defaultRepos: [],
  },
  kodachi: {
    id: "kodachi",
    name: "Linux Kodachi",
    family: "debian",
    packageManager: "apt",
    isSecurityFocused: true,
    isPrivacyFocused: true,
    defaultRepos: [],
  },
  parrot: {
    id: "parrot",
    name: "Parrot OS",
    family: "debian",
    packageManager: "apt",
    isSecurityFocused: true,
    isPrivacyFocused: true,
    defaultRepos: [],
  },
  fedora: {
    id: "fedora",
    name: "Fedora",
    family: "redhat",
    packageManager: "dnf",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    defaultRepos: [],
  },
  centos: {
    id: "centos",
    name: "CentOS",
    family: "redhat",
    packageManager: "yum",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    defaultRepos: [],
  },
  rhel: {
    id: "rhel",
    name: "Red Hat Enterprise Linux",
    family: "redhat",
    packageManager: "dnf",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    defaultRepos: [],
  },
  rocky: {
    id: "rocky",
    name: "Rocky Linux",
    family: "redhat",
    packageManager: "dnf",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    defaultRepos: [],
  },
  alma: {
    id: "alma",
    name: "AlmaLinux",
    family: "redhat",
    packageManager: "dnf",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    defaultRepos: [],
  },
  freebsd: {
    id: "freebsd",
    name: "FreeBSD",
    family: "bsd",
    packageManager: "pkg",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    defaultRepos: [],
  },
  openbsd: {
    id: "openbsd",
    name: "OpenBSD",
    family: "bsd",
    packageManager: "pkg_add",
    isSecurityFocused: true,
    isPrivacyFocused: false,
    defaultRepos: [],
  },
  netbsd: {
    id: "netbsd",
    name: "NetBSD",
    family: "bsd",
    packageManager: "pkgin",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    defaultRepos: [],
  },
  generic: {
    id: "generic",
    name: "Unknown",
    family: "debian",
    packageManager: "apt",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    defaultRepos: [],
  },
};

const PACKAGE_MANAGERS: Record<string, PackageManager> = {
  pkg: {
    name: "pkg",
    install: "pkg install -y",
    uninstall: "pkg uninstall -y",
    update: "pkg update",
    upgrade: "pkg upgrade -y",
    search: "pkg search",
    info: "pkg show",
    clean: "pkg autoclean",
    needsSudo: false,
  },
  apk: {
    name: "apk",
    install: "apk add",
    uninstall: "apk del",
    update: "apk update",
    upgrade: "apk upgrade",
    search: "apk search",
    info: "apk info",
    clean: "apk cache clean",
    needsSudo: true,
  },
  apt: {
    name: "apt",
    install: "apt install -y",
    uninstall: "apt remove -y",
    update: "apt update",
    upgrade: "apt upgrade -y",
    search: "apt search",
    info: "apt show",
    clean: "apt autoremove -y && apt clean",
    needsSudo: true,
    supportsSnap: true,
    supportsFlatpak: true,
  },
  pacman: {
    name: "pacman",
    install: "pacman -S --noconfirm",
    uninstall: "pacman -R --noconfirm",
    update: "pacman -Sy",
    upgrade: "pacman -Syu --noconfirm",
    search: "pacman -Ss",
    info: "pacman -Si",
    clean: "pacman -Sc --noconfirm",
    needsSudo: true,
    supportsAUR: true,
  },
  dnf: {
    name: "dnf",
    install: "dnf install -y",
    uninstall: "dnf remove -y",
    update: "dnf check-update",
    upgrade: "dnf upgrade -y",
    search: "dnf search",
    info: "dnf info",
    clean: "dnf clean all",
    needsSudo: true,
    supportsFlatpak: true,
  },
  yum: {
    name: "yum",
    install: "yum install -y",
    uninstall: "yum remove -y",
    update: "yum check-update",
    upgrade: "yum update -y",
    search: "yum search",
    info: "yum info",
    clean: "yum clean all",
    needsSudo: true,
  },
  pkg_bsd: {
    name: "pkg",
    install: "pkg install -y",
    uninstall: "pkg delete -y",
    update: "pkg update",
    upgrade: "pkg upgrade -y",
    search: "pkg search",
    info: "pkg info",
    clean: "pkg clean -y",
    needsSudo: true,
  },
  pkg_add: {
    name: "pkg_add",
    install: "pkg_add",
    uninstall: "pkg_delete",
    update: "pkg_add -u",
    upgrade: "pkg_add -u",
    search: "pkg_info -Q",
    info: "pkg_info",
    clean: "pkg_delete -a",
    needsSudo: true,
  },
  pkgin: {
    name: "pkgin",
    install: "pkgin -y install",
    uninstall: "pkgin -y remove",
    update: "pkgin update",
    upgrade: "pkgin -y upgrade",
    search: "pkgin search",
    info: "pkgin show",
    clean: "pkgin clean",
    needsSudo: true,
  },
};

export async function detectPlatform(): Promise<PlatformInfo> {
  const os = Deno.build.os;
  let platform: Platform;
  let distribution: Distribution = "generic";
  let isMobile = false;
  let mobileConfig: MobileConfig | undefined;
  let isWSL = false;
  let isContainer = false;
  let arch: "x64" | "arm64" | "arm" | "x86" = "x64";

  // Detect architecture
  const archOutput = await exec(["uname", "-m"]);
  const archStr = archOutput.stdout.trim();
  if (archStr === "x86_64") arch = "x64";
  else if (archStr === "aarch64" || archStr === "arm64") arch = "arm64";
  else if (archStr === "armv7l" || archStr === "armhf") arch = "arm";
  else if (archStr === "i386" || archStr === "i686") arch = "x86";

  // Detect mobile environments first
  if (os === "linux") {
    // Check for Termux (Android)
    if (Deno.env.get("TERMUX_VERSION") || await exists("/data/data/com.termux/files/usr")) {
      platform = "android";
      distribution = "termux";
      isMobile = true;
      
      const storagePath = Deno.env.get("HOME") || "/data/data/com.termux/files/home";
      mobileConfig = {
        isTermux: true,
        isISH: false,
        isRooted: await exists("/system/bin/su") || await exists("/sbin/su"),
        storagePath,
        hasProot: await exists("/data/data/com.termux/files/usr/bin/proot"),
      };
    }
    // Check for iSH (iOS)
    else if (await exists("/ish") || await exists("/proc/ish")) {
      platform = "ios";
      distribution = "ish";
      isMobile = true;
      
      mobileConfig = {
        isTermux: false,
        isISH: true,
        isRooted: false, // iOS is never truly rooted in iSH
        storagePath: "/root", // iSH runs as root
        hasProot: false,
      };
    } else {
      platform = "linux";
      
      // Detect specific distribution
      distribution = await detectLinuxDistribution();
      
      // Check for WSL
      const wslCheck = await exec(["uname", "-r"]);
      isWSL = wslCheck.stdout.toLowerCase().includes("microsoft") || 
              wslCheck.stdout.toLowerCase().includes("wsl");
      
      // Check for container
      isContainer = await exists("/.dockerenv") || 
                    await exists("/run/.containerenv");
    }
  } else if (os === "darwin") {
    platform = "macos";
    // macOS doesn't have the specific distributions listed, but could detect variants
  } else if (os === "windows") {
    platform = "windows";
  } else {
    // BSD detection
    const uname = await exec(["uname", "-s"]);
    const sys = uname.stdout.trim().toLowerCase();
    if (sys.includes("freebsd")) {
      platform = "freebsd";
      distribution = "freebsd";
    } else if (sys.includes("openbsd")) {
      platform = "openbsd";
      distribution = "openbsd";
    } else if (sys.includes("netbsd")) {
      platform = "netbsd";
      distribution = "netbsd";
    } else {
      throw new Error(`Unsupported operating system: ${sys}`);
    }
  }

  const distConfig = DISTRIBUTIONS[distribution];
  const pm = PACKAGE_MANAGERS[distConfig.packageManager];

  return {
    os: platform,
    arch,
    distribution: distConfig,
    isMobile,
    mobileConfig,
    isWSL,
    isContainer,
    shell: isMobile ? "/bin/sh" : Deno.env.get("SHELL") || "/bin/sh",
    packageManager: pm,
    paths: getPaths(platform, isMobile, mobileConfig),
  };
}

async function detectLinuxDistribution(): Promise<Distribution> {
  // Check /etc/os-release first
  try {
    const osRelease = await Deno.readTextFile("/etc/os-release");
    const id = osRelease.match(/^ID=(.+)$/m)?.[1]?.replace(/"/g, "").toLowerCase();
    const idLike = osRelease.match(/^ID_LIKE=(.+)$/m)?.[1]?.replace(/"/g, "").toLowerCase();

    if (id?.includes("kodachi")) return "kodachi";
    if (id?.includes("parrot")) return "parrot";
    if (id?.includes("blackarch")) return "blackarch";
    if (id?.includes("arch")) return "arch";
    if (id?.includes("manjaro")) return "manjaro";
    if (id?.includes("alpine")) return "alpine";
    if (id?.includes("elementary")) return "elementary";
    if (id?.includes("mint")) return "mint";
    if (id?.includes("ubuntu")) return "ubuntu";
    if (id?.includes("debian")) return "debian";
    if (id?.includes("fedora")) return "fedora";
    if (id?.includes("centos")) return "centos";
    if (id?.includes("rhel")) return "rhel";
    if (id?.includes("rocky")) return "rocky";
    if (id?.includes("alma")) return "alma";
    
    // Check ID_LIKE for derivatives
    if (idLike?.includes("debian")) return "debian";
    if (idLike?.includes("arch")) return "arch";
    if (idLike?.includes("fedora") || idLike?.includes("rhel")) return "fedora";
  } catch {
    // Fall through to other detection methods
  }

  // Check for specific files
  if (await exists("/etc/arch-release")) return "arch";
  if (await exists("/etc/debian_version")) return "debian";
  if (await exists("/etc/redhat-release")) {
    const rh = await Deno.readTextFile("/etc/redhat-release");
    if (rh.toLowerCase().includes("centos")) return "centos";
    if (rh.toLowerCase().includes("fedora")) return "fedora";
    return "rhel";
  }
  if (await exists("/etc/alpine-release")) return "alpine";

  return "generic";
}

function getPaths(
  platform: Platform, 
  isMobile: boolean, 
  mobileConfig?: MobileConfig
): PlatformInfo["paths"] {
  if (isMobile && mobileConfig) {
    if (mobileConfig.isTermux) {
      return {
        installDir: "/data/data/com.termux/files/usr/opt/ultimate-installer",
        binDir: "/data/data/com.termux/files/usr/bin",
        configDir: "/data/data/com.termux/files/home/.config/ultimate-installer",
        cacheDir: "/data/data/com.termux/files/usr/tmp/ui-cache",
      };
    } else if (mobileConfig.isISH) {
      return {
        installDir: "/opt/ultimate-installer",
        binDir: "/usr/local/bin",
        configDir: "/root/.config/ultimate-installer",
        cacheDir: "/tmp/ui-cache",
      };
    }
  }

  // Standard paths
  const home = Deno.env.get("HOME") || "/root";
  
  if (platform === "windows") {
    const localAppData = Deno.env.get("LOCALAPPDATA") || home;
    return {
      installDir: `${home}\\.ultimate-installer`,
      binDir: `${localAppData}\\Microsoft\\WindowsApps`,
      configDir: `${home}\\AppData\\Roaming\\ultimate-installer`,
      cacheDir: `${home}\\AppData\\Local\\Temp\\ui-cache`,
    };
  }

  return {
    installDir: "/opt/ultimate-installer",
    binDir: "/usr/local/bin",
    configDir: `${home}/.config/ultimate-installer`,
    cacheDir: "/var/cache/ultimate-installer",
  };
}

async function exists(path: string): Promise<boolean> {
  try {
    await Deno.stat(path);
    return true;
  } catch {
    return false;
  }
}
