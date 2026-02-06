import { PlatformConfig } from "../schema.ts";

export const termux: PlatformConfig = {
  id: "termux",
  name: "Termux (Android)",
  family: "mobile",
  packageManager: "pkg",
  isSecurityFocused: false,
  isPrivacyFocused: false,
  supportedArchitectures: ["arm64", "arm", "x64"],
  isMobile: true,
  defaultRepos: ["https://packages.termux.dev/apt/termux-main"],
  installCommand: "pkg install -y",
  uninstallCommand: "pkg uninstall -y",
  updateCommand: "pkg update",
  upgradeCommand: "pkg upgrade -y",
  searchCommand: "pkg search",
  infoCommand: "pkg show",
  cleanCommand: "pkg autoclean",
  needsSudo: false,
  paths: {
    installDir: "/data/data/com.termux/files/usr/opt/ultimate-installer",
    binDir: "/data/data/com.termux/files/usr/bin",
    configDir: "/data/data/com.termux/files/home/.config/ultimate-installer",
    cacheDir: "/data/data/com.termux/files/usr/tmp/ui-cache",
  },
};
