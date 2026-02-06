import { PlatformConfig } from "../schema.ts";

export const bsd: PlatformConfig = {
  id: "bsd",
  name: "BSD",
  family: "bsd",
  packageManager: "pkg",
  isSecurityFocused: false,
  isPrivacyFocused: false,
  supportedArchitectures: ["x64"],
  defaultRepos: [],
  installCommand: "pkg install -y",
  uninstallCommand: "pkg delete -y",
  updateCommand: "pkg update",
  upgradeCommand: "pkg upgrade -y",
  searchCommand: "pkg search",
  infoCommand: "pkg info",
  cleanCommand: "pkg clean -y",
  needsSudo: true,
};
