// Configuration schema types for Ultimate Installer
// Comprehensive support for all operating systems including mobile, embedded, network, and legacy systems

export type Platform = 
  | "linux" 
  | "macos" 
  | "windows"
  | "android"      // Termux and native Android
  | "ios"          // iSH and native iOS
  | "chromeos"     // ChromeOS Linux container (Crostini)
  | "freebsd"
  | "openbsd"
  | "netbsd"
  | "dragonfly"    // DragonFly BSD
  | "illumos"      // OpenIndiana, OmniOS, SmartOS
  | "haiku"        // Haiku OS (BeOS successor)
  | "reactos"      // ReactOS (Windows NT clone)
  | "minix"        // MINIX 3
  | "redox"        // Redox OS (Rust-based)
  | "fuchsia"      // Google Fuchsia
  | "serenityos"   // SerenityOS
  | "web"          // Web-based systems (webOS, ChromeOS web)
  | "embedded";    // Generic embedded Linux

export type Distribution =
  // Generic/Mobile
  | "generic"
  | "termux"           // Android/Termux
  | "ish"              // iOS/iSH
  | "android"          // Native Android (LineageOS, etc.)
  
  // Alpine-based
  | "alpine"
  | "postmarketos"     // Mobile Linux based on Alpine
  
  // Arch-based
  | "arch"
  | "blackarch"
  | "manjaro"
  | "garuda"
  | "endeavouros"
  | "arcolinux"
  | "artix"            // Arch without systemd
  | "cachyos"
  
  // Debian-based
  | "debian"
  | "ubuntu"
  | "mint"
  | "elementary"
  | "pop"
  | "zorin"
  | "kali"
  | "parrot"
  | "kodachi"
  | "tails"            // Privacy-focused live OS
  | "devuan"           // Debian without systemd
  | "mxlinux"
  | "antix"
  | "deepin"
  | "pureos"           // Purism Librem
  | "ubuntumate"
  | "xubuntu"
  | "lubuntu"
  | "kubuntu"
  | "ubuntubudgie"
  | "ubuntustudio"
  | "ubuntukylin"
  | "neon"             // KDE Neon
  | "crunchbangplusplus"
  | "peppermint"
  | "bodhi"
  | "parrot"
  | "raspbian"         // Raspberry Pi OS 32-bit (legacy)
  | "raspberrypi"      // Raspberry Pi OS 64-bit
  
  // Red Hat-based
  | "fedora"
  | "centos"
  | "rhel"
  | "rocky"
  | "alma"
  | "oracle"
  | "scientific"
  | "clearos"
  | "amazon"
  | "qubes"            // Security-focused Xen-based
  
  // SUSE-based
  | "opensuse"
  | "tumbleweed"
  | "leap"
  | "sles"             // SUSE Linux Enterprise
  
  // Gentoo-based
  | "gentoo"
  | "pentoo"           // Gentoo-based security
  | "calculate"
  | "funtoo"
  | "sabayon"
  
  // Nix/Guix
  | "nixos"            // Purely functional Linux
  | "guix"             // GNU Guix System
  
  // Slackware-based
  | "slackware"
  | "salix"
  | "zenwalk"
  | "vector"
  
  // Mandriva-based
  | "mageia"
  | "rosa"
  | "openmandriva"
  | "pclinuxos"
  
  // Independent/Other
  | "solus"
  | "void"             // Void Linux (runit)
  | "clear"            // Intel Clear Linux
  | "alma"
  | "alpine"
  | "cuboos"
  | "chromeos"         // ChromeOS Linux (Crostini)
  | "crux"             // CRUX Linux
  | "gobo"
  | "lunar"
  | "sourcemage"
  | "tiny"
  | "porteus"          // Portable Linux
  | "slax"             // Live/Portable Debian
  | "knoppix"
  | "dsl"              // Damn Small Linux
  
  // Mobile-specific Linux
  | "mobian"           // Debian for mobile
  | "ubuntutouch"      // Ubuntu Touch
  | "plasmamobile"     // KDE Plasma Mobile
  | "luneos"           // WebOS successor
  | "sailfishos"       // Jolla Sailfish OS
  | "kaios"            // KaiOS (Firefox OS fork)
  | "webos"            // LG webOS
  
  // Network/Security Appliances
  | "openwrt"          // Router firmware
  | "lede"             // Legacy OpenWrt
  | "pfsense"          // FreeBSD-based firewall
  | "opnsense"         // FreeBSD-based firewall
  | "ipfire"           // Linux firewall
  | "vyos"             // Network OS
  | "zeroshell"
  | "smoothwall"
  | "endian"
  | "clearos"
  
  // NAS/Storage
  | "truenas"          // TrueNAS CORE/SCALE
  | "freenas"          // Legacy FreeNAS
  | "xigmanas"
  | "openmediavault"
  | "unraid"
  | "rockstor"
  
  // BSD variants
  | "freebsd"
  | "openbsd"
  | "netbsd"
  | "dragonfly"
  | "ghostbsd"
  | "midnightbsd"
  | "nomadbsd"
  | "furybsd"
  | "hello"
  
  // illumos/Unix
  | "openindiana"      // Solaris successor
  | "omnios"
  | "smartos"
  | "tribblix"
  | "dilos"
  
  // Other Unix-like
  | "haiku"
  | "reactos"
  | "minix"
  | "redox"
  | "serenityos"
  | "menuetos"         // Assembly language OS
  | "kolibrios"
  
  // Container/Cloud optimized
  | "coreos"           // Fedora CoreOS
  | "flatcar"          // Flatcar Container Linux
  | "rancheros"
  | "k3os"
  | "talos"            // Kubernetes OS
  | "bottlerocket"     // AWS container OS
  | "gardenlinux"      // SAP Garden Linux
  
  // Special purpose
  | "kali"
  | "pentoo"
  | "parrot"
  | "blackarch"
  | "caine"            // Computer forensics
  | "deft"             // Digital Evidence & Forensics Toolkit
  | "sift"             // SANS Investigate Forensic Toolkit
  | "remnux"           // Malware analysis
  | "securityonion"    // Network security monitoring
  | "kalilinux"
  | "parrotsec"
  | "backbox"
  | "cyborg"
  | "samuraiwebtestingframework"
  
  // Educational/Research
  | "sugar"            // Sugar on a Stick
  | "edubuntu"
  | "fedorasoa"        // Fedora Spin of Sugar
  | "opensuseeducation"
  | "uberstudent"
  | "kwheezy";

export interface MobileConfig {
  isTermux: boolean;
  isISH: boolean;
  isRooted: boolean;
  storagePath: string;
  hasProot: boolean;
  deviceModel?: string;
  androidVersion?: string;
  iosVersion?: string;
}

export interface EmbeddedConfig {
  isEmbedded: boolean;
  deviceType: "router" | "nas" | "iot" | "sbc" | "mobile" | "other";
  hasLimitedStorage: boolean;
  hasLimitedRam: boolean;
  architecture: string;
  bootloader?: string;
}

export interface NetworkConfig {
  isNetworkOS: boolean;
  firewallType?: "iptables" | "nftables" | "pf" | "ipfw";
  hasWebInterface: boolean;
  defaultInterfaces: string[];
}

export interface DistributionConfig {
  id: Distribution;
  name: string;
  family: "debian" | "redhat" | "arch" | "alpine" | "bsd" | "mobile" | "suse" | "gentoo" | "slackware" | "nix" | "independent" | "embedded" | "network" | "illumos" | "other";
  packageManager: string;
  isSecurityFocused: boolean;
  isPrivacyFocused: boolean;
  isLiveCD: boolean;
  isPortable: boolean;
  defaultRepos: readonly string[];
  supportedArchitectures: readonly string[];
}

export interface PackageManager {
  readonly name: string;
  readonly install: string;
  readonly uninstall: string;
  readonly update: string;
  readonly upgrade: string;
  readonly search: string;
  readonly info: string;
  readonly clean: string;
  readonly needsSudo: boolean;
  readonly supportsAUR?: boolean;
  readonly supportsSnap?: boolean;
  readonly supportsFlatpak?: boolean;
  readonly supportsAppImage?: boolean;
  readonly supportsNix?: boolean;
  readonly supportsGuix?: boolean;
}

export interface ToolCategory {
  id: string;
  name: string;
  description: string;
  tools: readonly Tool[];
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  platforms: readonly Platform[];
  distributions?: readonly Distribution[];
  packageName: Readonly<Record<Distribution, string | null>>;
  postInstall?: readonly string[];
  isGUI: boolean;
  sizeMB: number;
  tags: readonly string[];
}

export interface PlatformPaths {
  unix: Paths;
  windows: Paths;
}

export interface Paths {
  installDir: string;
  binDir: string;
  configDir: string;
}

export interface Component {
  id: string;
  name: string;
  description: string;
  default: boolean;
  platforms: readonly Platform[];
  dependencies?: readonly string[];
  install?: InstallConfig;
}

export interface InstallConfig {
  packages?: Readonly<PackageMap>;
  commands?: Readonly<CommandMap>;
  scripts?: readonly string[];
}

export type PackageMap = Readonly<Record<string, readonly string[]>>;
export type CommandMap = Readonly<Record<string, readonly string[]>>;

export interface PackageManagerMap {
  linux: readonly PackageManager[];
  macos: readonly PackageManager[];
  windows: readonly PackageManager[];
}

export interface UrlConfig {
  repo: string;
  releases: string;
  raw: string;
}

export interface InstallOptions {
  components: readonly string[];
  dryRun: boolean;
  yes: boolean;
  verbose: boolean;
}

export interface PlatformInfo {
  os: Platform;
  arch: "x64" | "arm64" | "arm" | "x86" | "riscv64" | "mips" | "mipsel" | "ppc64le" | "s390x";
  distribution: DistributionConfig;
  isMobile: boolean;
  isEmbedded: boolean;
  isNetworkOS: boolean;
  mobileConfig?: MobileConfig;
  embeddedConfig?: EmbeddedConfig;
  networkConfig?: NetworkConfig;
  isWSL: boolean;
  isContainer: boolean;
  isLiveCD: boolean;
  isPortable: boolean;
  shell: string;
  packageManager: PackageManager;
  paths: {
    installDir: string;
    binDir: string;
    configDir: string;
    cacheDir: string;
  };
}