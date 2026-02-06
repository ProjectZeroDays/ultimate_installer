// Extended schema with mobile and specialized distros

export type Platform = 
  | "linux" 
  | "macos" 
  | "windows"
  | "android"      // Termux
  | "ios"          // iSH
  | "freebsd"
  | "openbsd"
  | "netbsd";

export type Distribution =
  | "generic"
  | "termux"       // Android
  | "ish"          // iOS (Alpine-based)
  | "alpine"
  | "arch"
  | "blackarch"
  | "manjaro"
  | "debian"
  | "ubuntu"
  | "mint"
  | "elementary"
  | "kodachi"
  | "parrot"
  | "fedora"
  | "centos"
  | "rhel"
  | "rocky"
  | "alma"
  | "freebsd"
  | "openbsd"
  | "netbsd";

export interface MobileConfig {
  isTermux: boolean;
  isISH: boolean;
  isRooted: boolean;
  storagePath: string;
  hasProot: boolean;
}

export interface DistributionConfig {
  id: Distribution;
  name: string;
  family: "debian" | "redhat" | "arch" | "alpine" | "bsd" | "mobile";
  packageManager: string;
  isSecurityFocused: boolean;
  isPrivacyFocused: boolean;
  defaultRepos: string[];
}

export interface PackageManager {
  name: string;
  install: string;
  uninstall: string;
  update: string;
  upgrade: string;
  search: string;
  info: string;
  clean: string;
  needsSudo: boolean;
  supportsAUR?: boolean;      // Arch User Repository
  supportsSnap?: boolean;
  supportsFlatpak?: boolean;
  supportsAppImage?: boolean;
}

export interface ToolCategory {
  id: string;
  name: string;
  description: string;
  tools: Tool[];
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  platforms: Platform[];
  distributions?: Distribution[]; // Specific to certain distros
  packageName: Record<Distribution, string | null>; // null = not available
  postInstall?: string[];
  isGUI: boolean;
  sizeMB: number;
  tags: string[];
}

export interface PlatformInfo {
  os: Platform;
  arch: "x64" | "arm64" | "arm" | "x86";
  distribution: DistributionConfig;
  isMobile: boolean;
  mobileConfig?: MobileConfig;
  isWSL: boolean;
  isContainer: boolean;
  shell: string;
  packageManager: PackageManager;
  paths: {
    installDir: string;
    binDir: string;
    configDir: string;
    cacheDir: string;
  };
}
