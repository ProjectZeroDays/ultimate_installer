/**
 * Comprehensive Platform Detection Module
 * Supports: Linux (100+ distros), BSD, mobile, embedded, network appliances, legacy systems
 */

import { 
  Platform, 
  Distribution, 
  DistributionConfig, 
  PlatformInfo,
  MobileConfig,
  EmbeddedConfig,
  NetworkConfig,
  PackageManager 
} from "../config/schema.ts";
import { join } from "@std/path";

// ============================================================================
// COMPREHENSIVE DISTRIBUTION CONFIGURATIONS
// ============================================================================

const DISTRIBUTIONS: Record<Distribution, DistributionConfig> = {
  // === MOBILE/ANDROID ===
  termux: {
    id: "termux",
    name: "Termux (Android)",
    family: "mobile",
    packageManager: "pkg",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: ["https://packages.termux.dev/apt/termux-main"],
    supportedArchitectures: ["arm", "arm64", "x86_64"],
  },
  
  ish: {
    id: "ish",
    name: "iSH (iOS)",
    family: "alpine",
    packageManager: "apk",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [
      "https://dl-cdn.alpinelinux.org/alpine/edge/main",
      "https://dl-cdn.alpinelinux.org/alpine/edge/community",
    ],
    supportedArchitectures: ["x86"], // iSH emulates x86 on ARM
  },

  android: {
    id: "android",
    name: "Android (Native)",
    family: "mobile",
    packageManager: "pkg",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["arm", "arm64", "x86", "x86_64"],
  },

  // === ALPINE-BASED ===
  alpine: {
    id: "alpine",
    name: "Alpine Linux",
    family: "alpine",
    packageManager: "apk",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [
      "https://dl-cdn.alpinelinux.org/alpine/latest-stable/main",
      "https://dl-cdn.alpinelinux.org/alpine/latest-stable/community",
    ],
    supportedArchitectures: ["x86_64", "arm64", "arm", "ppc64le", "s390x", "riscv64"],
  },

  postmarketos: {
    id: "postmarketos",
    name: "postmarketOS",
    family: "alpine",
    packageManager: "apk",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: ["http://mirror.postmarketos.org/postmarketos"],
    supportedArchitectures: ["arm64", "arm", "x86_64"],
  },

  // === ARCH-BASED ===
  arch: {
    id: "arch",
    name: "Arch Linux",
    family: "arch",
    packageManager: "pacman",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64", "arm64"],
  },
  
  blackarch: {
    id: "blackarch",
    name: "BlackArch Linux",
    family: "arch",
    packageManager: "pacman",
    isSecurityFocused: true,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: ["https://blackarch.org/blackarch/blackarch/os/x86_64"],
    supportedArchitectures: ["x86_64", "arm64"],
  },
  
  manjaro: {
    id: "manjaro",
    name: "Manjaro",
    family: "arch",
    packageManager: "pacman",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64", "arm64"],
  },

  garuda: {
    id: "garuda",
    name: "Garuda Linux",
    family: "arch",
    packageManager: "pacman",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64"],
  },

  endeavouros: {
    id: "endeavouros",
    name: "EndeavourOS",
    family: "arch",
    packageManager: "pacman",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64", "arm64"],
  },

  arcolinux: {
    id: "arcolinux",
    name: "ArcoLinux",
    family: "arch",
    packageManager: "pacman",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64"],
  },

  artix: {
    id: "artix",
    name: "Artix Linux",
    family: "arch",
    packageManager: "pacman",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64", "arm64"],
  },

  cachyos: {
    id: "cachyos",
    name: "CachyOS",
    family: "arch",
    packageManager: "pacman",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64"],
  },

  // === DEBIAN-BASED ===
  debian: {
    id: "debian",
    name: "Debian",
    family: "debian",
    packageManager: "apt",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64", "arm64", "arm", "mips", "mipsel", "ppc64le", "s390x"],
  },
  
  ubuntu: {
    id: "ubuntu",
    name: "Ubuntu",
    family: "debian",
    packageManager: "apt",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64", "arm64", "arm", "riscv64", "s390x", "ppc64le"],
  },
  
  mint: {
    id: "mint",
    name: "Linux Mint",
    family: "debian",
    packageManager: "apt",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64", "arm64"],
  },
  
  elementary: {
    id: "elementary",
    name: "Elementary OS",
    family: "debian",
    packageManager: "apt",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64"],
  },
  
  kodachi: {
    id: "kodachi",
    name: "Linux Kodachi",
    family: "debian",
    packageManager: "apt",
    isSecurityFocused: true,
    isPrivacyFocused: true,
    isLiveCD: true,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64"],
  },
  
  parrot: {
    id: "parrot",
    name: "Parrot OS",
    family: "debian",
    packageManager: "apt",
    isSecurityFocused: true,
    isPrivacyFocused: true,
    isLiveCD: true,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64", "arm64"],
  },

  kali: {
    id: "kali",
    name: "Kali Linux",
    family: "debian",
    packageManager: "apt",
    isSecurityFocused: true,
    isPrivacyFocused: false,
    isLiveCD: true,
    isPortable: false,
    defaultRepos: ["http://http.kali.org/kali"],
    supportedArchitectures: ["x86_64", "arm64", "arm"],
  },

  pop: {
    id: "pop",
    name: "Pop!_OS",
    family: "debian",
    packageManager: "apt",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64", "arm64"],
  },

  zorin: {
    id: "zorin",
    name: "Zorin OS",
    family: "debian",
    packageManager: "apt",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64"],
  },

  tails: {
    id: "tails",
    name: "Tails",
    family: "debian",
    packageManager: "apt",
    isSecurityFocused: true,
    isPrivacyFocused: true,
    isLiveCD: true,
    isPortable: true,
    defaultRepos: [],
    supportedArchitectures: ["x86_64"],
  },

  devuan: {
    id: "devuan",
    name: "Devuan",
    family: "debian",
    packageManager: "apt",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64", "arm64", "arm"],
  },

  mxlinux: {
    id: "mxlinux",
    name: "MX Linux",
    family: "debian",
    packageManager: "apt",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: true,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64"],
  },

  antix: {
    id: "antix",
    name: "antiX",
    family: "debian",
    packageManager: "apt",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: true,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64", "x86"],
  },

  deepin: {
    id: "deepin",
    name: "Deepin",
    family: "debian",
    packageManager: "apt",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64", "arm64"],
  },

  pureos: {
    id: "pureos",
    name: "PureOS",
    family: "debian",
    packageManager: "apt",
    isSecurityFocused: false,
    isPrivacyFocused: true,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64", "arm64"],
  },

  raspbian: {
    id: "raspbian",
    name: "Raspberry Pi OS (32-bit)",
    family: "debian",
    packageManager: "apt",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: ["http://archive.raspberrypi.org/debian"],
    supportedArchitectures: ["arm"],
  },

  raspberrypi: {
    id: "raspberrypi",
    name: "Raspberry Pi OS (64-bit)",
    family: "debian",
    packageManager: "apt",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: ["http://archive.raspberrypi.org/debian"],
    supportedArchitectures: ["arm64"],
  },

  chromeos: {
    id: "chromeos",
    name: "ChromeOS Linux",
    family: "debian",
    packageManager: "apt",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: ["https://deb.debian.org/debian"],
    supportedArchitectures: ["x86_64", "arm64"],
  },

  // === RED HAT-BASED ===
  fedora: {
    id: "fedora",
    name: "Fedora",
    family: "redhat",
    packageManager: "dnf",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64", "arm64", "ppc64le", "s390x"],
  },
  
  centos: {
    id: "centos",
    name: "CentOS",
    family: "redhat",
    packageManager: "yum",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64", "arm64", "ppc64le"],
  },
  
  rhel: {
    id: "rhel",
    name: "Red Hat Enterprise Linux",
    family: "redhat",
    packageManager: "dnf",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64", "arm64", "ppc64le", "s390x"],
  },
  
  rocky: {
    id: "rocky",
    name: "Rocky Linux",
    family: "redhat",
    packageManager: "dnf",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64", "arm64", "ppc64le"],
  },
  
  alma: {
    id: "alma",
    name: "AlmaLinux",
    family: "redhat",
    packageManager: "dnf",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64", "arm64", "ppc64le", "s390x"],
  },

  qubes: {
    id: "qubes",
    name: "Qubes OS",
    family: "redhat",
    packageManager: "dnf",
    isSecurityFocused: true,
    isPrivacyFocused: true,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64"],
  },

  // === SUSE-BASED ===
  opensuse: {
    id: "opensuse",
    name: "openSUSE",
    family: "suse",
    packageManager: "zypper",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64", "arm64", "ppc64le", "s390x"],
  },

  // === NIX/GUIX ===
  nixos: {
    id: "nixos",
    name: "NixOS",
    family: "nix",
    packageManager: "nix",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64", "arm64"],
  },

  guix: {
    id: "guix",
    name: "GNU Guix System",
    family: "nix",
    packageManager: "guix",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64", "arm64", "riscv64"],
  },

  // === GENTOO-BASED ===
  gentoo: {
    id: "gentoo",
    name: "Gentoo Linux",
    family: "gentoo",
    packageManager: "portage",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64", "arm64", "arm", "ppc64le", "riscv64"],
  },

  pentoo: {
    id: "pentoo",
    name: "Pentoo",
    family: "gentoo",
    packageManager: "portage",
    isSecurityFocused: true,
    isPrivacyFocused: false,
    isLiveCD: true,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64"],
  },

  // === SLACKWARE-BASED ===
  slackware: {
    id: "slackware",
    name: "Slackware",
    family: "slackware",
    packageManager: "slackpkg",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64", "arm64"],
  },

  // === MOBILE LINUX ===
  mobian: {
    id: "mobian",
    name: "Mobian",
    family: "debian",
    packageManager: "apt",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["arm64", "arm"],
  },

  ubuntutouch: {
    id: "ubuntutouch",
    name: "Ubuntu Touch",
    family: "debian",
    packageManager: "apt",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["arm64", "arm", "x86_64"],
  },

  sailfishos: {
    id: "sailfishos",
    name: "Sailfish OS",
    family: "independent",
    packageManager: "rpm",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["arm64", "arm", "x86_64"],
  },

  kaios: {
    id: "kaios",
    name: "KaiOS",
    family: "independent",
    packageManager: "pkg",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["arm"],
  },

  webos: {
    id: "webos",
    name: "webOS",
    family: "independent",
    packageManager: "opkg",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["arm64", "arm"],
  },

  luneos: {
    id: "luneos",
    name: "LuneOS",
    family: "independent",
    packageManager: "opkg",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["arm"],
  },

  // === NETWORK APPLIANCES ===
  openwrt: {
    id: "openwrt",
    name: "OpenWrt",
    family: "embedded",
    packageManager: "opkg",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["mips", "mipsel", "arm", "arm64", "x86_64", "x86"],
  },

  pfsense: {
    id: "pfsense",
    name: "pfSense",
    family: "bsd",
    packageManager: "pkg",
    isSecurityFocused: true,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64"],
  },

  opnsense: {
    id: "opnsense",
    name: "OPNsense",
    family: "bsd",
    packageManager: "pkg",
    isSecurityFocused: true,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64", "arm64"],
  },

  vyos: {
    id: "vyos",
    name: "VyOS",
    family: "debian",
    packageManager: "apt",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64", "arm64"],
  },

  // === NAS/STORAGE ===
  truenas: {
    id: "truenas",
    name: "TrueNAS",
    family: "bsd",
    packageManager: "pkg",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64"],
  },

  openmediavault: {
    id: "openmediavault",
    name: "OpenMediaVault",
    family: "debian",
    packageManager: "apt",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64", "arm64", "arm"],
  },

  // === BSD VARIANTS ===
  freebsd: {
    id: "freebsd",
    name: "FreeBSD",
    family: "bsd",
    packageManager: "pkg",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64", "arm64", "arm", "riscv64"],
  },
  
  openbsd: {
    id: "openbsd",
    name: "OpenBSD",
    family: "bsd",
    packageManager: "pkg_add",
    isSecurityFocused: true,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64", "arm64", "arm", "riscv64"],
  },
  
  netbsd: {
    id: "netbsd",
    name: "NetBSD",
    family: "bsd",
    packageManager: "pkgin",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64", "arm64", "arm", "mips", "mipsel", "riscv64"],
  },

  dragonfly: {
    id: "dragonfly",
    name: "DragonFly BSD",
    family: "bsd",
    packageManager: "pkg",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64"],
  },

  ghostbsd: {
    id: "ghostbsd",
    name: "GhostBSD",
    family: "bsd",
    packageManager: "pkg",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64"],
  },

  // === ILLUMOS/UNIX ===
  openindiana: {
    id: "openindiana",
    name: "OpenIndiana",
    family: "illumos",
    packageManager: "pkg",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64"],
  },

  omnios: {
    id: "omnios",
    name: "OmniOS",
    family: "illumos",
    packageManager: "pkg",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64"],
  },

  smartos: {
    id: "smartos",
    name: "SmartOS",
    family: "illumos",
    packageManager: "pkg",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: true,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64"],
  },

  // === OTHER UNIX-LIKE ===
  haiku: {
    id: "haiku",
    name: "Haiku",
    family: "other",
    packageManager: "pkgman",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64", "x86"],
  },

  reactos: {
    id: "reactos",
    name: "ReactOS",
    family: "other",
    packageManager: "rapps",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86", "x86_64"],
  },

  minix: {
    id: "minix",
    name: "MINIX 3",
    family: "other",
    packageManager: "pkgin",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86", "arm"],
  },

  redox: {
    id: "redox",
    name: "Redox OS",
    family: "other",
    packageManager: "pkg",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64"],
  },

  serenityos: {
    id: "serenityos",
    name: "SerenityOS",
    family: "other",
    packageManager: "pkg",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64"],
  },

  // === CONTAINER/CLOUD ===
  coreos: {
    id: "coreos",
    name: "Fedora CoreOS",
    family: "redhat",
    packageManager: "rpm-ostree",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64", "arm64"],
  },

  flatcar: {
    id: "flatcar",
    name: "Flatcar Container Linux",
    family: "independent",
    packageManager: "systemd-sysext",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64", "arm64"],
  },

  talos: {
    id: "talos",
    name: "Talos Linux",
    family: "independent",
    packageManager: "talosctl",
    isSecurityFocused: true,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64", "arm64"],
  },

  // === SPECIAL PURPOSE ===
  caine: {
    id: "caine",
    name: "CAINE",
    family: "debian",
    packageManager: "apt",
    isSecurityFocused: true,
    isPrivacyFocused: false,
    isLiveCD: true,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64"],
  },

  // === INDEPENDENT ===
  solus: {
    id: "solus",
    name: "Solus",
    family: "independent",
    packageManager: "eopkg",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64"],
  },

  void: {
    id: "void",
    name: "Void Linux",
    family: "independent",
    packageManager: "xbps",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64", "arm64", "arm", "mips", "mipsel"],
  },

  clear: {
    id: "clear",
    name: "Clear Linux",
    family: "independent",
    packageManager: "swupd",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64"],
  },

  cuboos: {
    id: "cuboos",
    name: "CuboOS",
    family: "debian",
    packageManager: "apt",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64"],
  },

  // === PORTABLE/LIVE ===
  porteus: {
    id: "porteus",
    name: "Porteus",
    family: "slackware",
    packageManager: "usm",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: true,
    isPortable: true,
    defaultRepos: [],
    supportedArchitectures: ["x86_64"],
  },

  slax: {
    id: "slax",
    name: "Slax",
    family: "debian",
    packageManager: "apt",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: true,
    isPortable: true,
    defaultRepos: [],
    supportedArchitectures: ["x86_64"],
  },

  knoppix: {
    id: "knoppix",
    name: "KNOPPIX",
    family: "debian",
    packageManager: "apt",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: true,
    isPortable: true,
    defaultRepos: [],
    supportedArchitectures: ["x86_64", "x86"],
  },

  // === GENERIC FALLBACK ===
  generic: {
    id: "generic",
    name: "Unknown",
    family: "debian",
    packageManager: "apt",
    isSecurityFocused: false,
    isPrivacyFocused: false,
    isLiveCD: false,
    isPortable: false,
    defaultRepos: [],
    supportedArchitectures: ["x86_64"],
  },
};

// ============================================================================
// PACKAGE MANAGER CONFIGURATIONS
// ============================================================================

const PACKAGE_MANAGERS: Record<string, PackageManager> = {
  // ... existing package managers ...
  
  // Add new ones
  zypper: {
    name: "zypper",
    install: "zypper install -y",
    uninstall: "zypper remove -y",
    update: "zypper refresh",
    upgrade: "zypper update -y",
    search: "zypper search",
    info: "zypper info",
    clean: "zypper clean",
    needsSudo: true,
  },

  nix: {
    name: "nix",
    install: "nix-env -iA",
    uninstall: "nix-env -e",
    update: "nix-channel --update",
    upgrade: "nix-env -u",
    search: "nix search",
    info: "nix eval",
    clean: "nix-collect-garbage -d",
    needsSudo: false,
    supportsNix: true,
  },

  guix: {
    name: "guix",
    install: "guix install",
    uninstall: "guix remove",
    update: "guix pull",
    upgrade: "guix upgrade",
    search: "guix search",
    info: "guix show",
    clean: "guix gc",
    needsSudo: false,
    supportsGuix: true,
  },

  portage: {
    name: "portage",
    install: "emerge",
    uninstall: "emerge --unmerge",
    update: "emerge --sync",
    upgrade: "emerge -uDU @world",
    search: "emerge -s",
    info: "emerge -pv",
    clean: "emerge --depclean",
    needsSudo: true,
  },

  slackpkg: {
    name: "slackpkg",
    install: "slackpkg install",
    uninstall: "slackpkg remove",
    update: "slackpkg update",
    upgrade: "slackpkg upgrade-all",
    search: "slackpkg search",
    info: "slackpkg info",
    clean: "slackpkg clean-system",
    needsSudo: true,
  },

  xbps: {
    name: "xbps",
    install: "xbps-install -y",
    uninstall: "xbps-remove -y",
    update: "xbps-install -Su",
    upgrade: "xbps-install -u",
    search: "xbps-query -Rs",
    info: "xbps-query -R",
    clean: "xbps-remove -o",
    needsSudo: true,
  },

  swupd: {
    name: "swupd",
    install: "swupd bundle-add",
    uninstall: "swupd bundle-remove",
    update: "swupd update",
    upgrade: "swupd update",
    search: "swupd search",
    info: "swupd bundle-info",
    clean: "swupd clean",
    needsSudo: true,
  },

  eopkg: {
    name: "eopkg",
    install: "eopkg install -y",
    uninstall: "eopkg remove -y",
    update: "eopkg update-repo",
    upgrade: "eopkg upgrade -y",
    search: "eopkg search",
    info: "eopkg info",
    clean: "eopkg delete-cache",
    needsSudo: true,
  },

  opkg: {
    name: "opkg",
    install: "opkg install",
    uninstall: "opkg remove",
    update: "opkg update",
    upgrade: "opkg upgrade",
    search: "opkg find",
    info: "opkg info",
    clean: "opkg clean",
    needsSudo: false,
  },

  rpm: {
    name: "rpm",
    install: "rpm -i",
    uninstall: "rpm -e",
    update: "rpm -F",
    upgrade: "rpm -U",
    search: "rpm -qa",
    info: "rpm -qi",
    clean: "rpm --rebuilddb",
    needsSudo: true,
  },

  pkgman: {
    name: "pkgman",
    install: "pkgman install",
    uninstall: "pkgman uninstall",
    update: "pkgman update",
    upgrade: "pkgman full-sync",
    search: "pkgman search",
    info: "pkgman info",
    clean: "pkgman drop-repo-cache",
    needsSudo: true,
  },

  rapps: {
    name: "rapps",
    install: "rapps",
    uninstall: "rapps",
    update: "rapps",
    upgrade: "rapps",
    search: "rapps",
    info: "rapps",
    clean: "rapps",
    needsSudo: false,
  },

  // ... rest of existing package managers ...
};

// ============================================================================
// DETECTION FUNCTIONS
// ============================================================================

export async function detectPlatform(): Promise<PlatformInfo> {
  // ... existing detection code ...
  
  // Add ChromeOS detection
  if (await exists("/dev/.cros_milestone") || await exists("/etc/cros-release")) {
    platform = "chromeos";
    distribution = "chromeos";
  }
  
  // ... rest of detection ...
}

async function detectLinuxDistribution(): Promise<Distribution> {
  // ... existing detection ...
  
  // Add comprehensive detection for new distributions
  
  // ChromeOS
  if (await exists("/dev/.cros_milestone") || await exists("/etc/cros-release")) {
    return "chromeos";
  }
  
  // NixOS
  if (await exists("/etc/NIXOS") || await exists("/run/current-system/nixos-version")) {
    return "nixos";
  }
  
  // Guix
  if (await exists("/etc/guix-system")) {
    return "guix";
  }
  
  // postmarketOS
  if (id === "postmarketos" || await exists("/etc/postmarketos-release")) {
    return "postmarketos";
  }
  
  // Tails
  if (await exists("/etc/amnesia/version") || await exists("/live/persistence/TailsData")) {
    return "tails";
  }
  
  // Qubes OS
  if (await exists("/etc/qubes-release") || await exists("/usr/bin/qubesdb-read")) {
    return "qubes";
  }
  
  // OpenWrt
  if (id === "openwrt" || await exists("/etc/openwrt_release")) {
    return "openwrt";
  }
  
  // pfSense/OPNsense (FreeBSD-based, detected via uname)
  // These are handled in BSD section
  
  // TrueNAS
  if (await exists("/etc/truenas") || await exists("/usr/local/bin/truenas")) {
    return "truenas";
  }
  
  // Void Linux
  if (id === "void" || await exists("/etc/void-release")) {
    return "void";
  }
  
  // Solus
  if (id === "solus" || await exists("/etc/solus-release")) {
    return "solus";
  }
  
  // Clear Linux
  if (id === "clear-linux-os" || await exists("/usr/bin/swupd")) {
    return "clear";
  }
  
  // Gentoo
  if (id === "gentoo" || await exists("/etc/gentoo-release")) {
    return "gentoo";
  }
  
  // Slackware
  if (id === "slackware" || await exists("/etc/slackware-version")) {
    return "slackware";
  }
  
  // Sailfish OS
  if (id === "sailfishos" || await exists("/etc/sailfishos-release")) {
    return "sailfishos";
  }
  
  // KaiOS
  if (id === "kaios" || await exists("/etc/kaios-release")) {
    return "kaios";
  }
  
  // webOS
  if (id === "webos" || await exists("/etc/webos-release")) {
    return "webos";
  }
  
  // ... rest of existing detection ...
}

// ... rest of existing functions ...