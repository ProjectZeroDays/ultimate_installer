import { PlatformConfig } from "../schema.ts";

export const debian: PlatformConfig = {
  id: "debian",
  name: "Debian",
  family: "debian",
  packageManager: "apt",
  isSecurityFocused: false,
  isPrivacyFocused: false,
  supportedArchitectures: ["x64", "arm64", "arm", "x86"],
  defaultRepos: [],
  installCommand: "apt install -y",
  uninstallCommand: "apt remove -y",
  updateCommand: "apt update",
  upgradeCommand: "apt upgrade -y",
  searchCommand: "apt search",
  infoCommand: "apt show",
  cleanCommand: "apt autoremove -y && apt clean",
  needsSudo: true,
  supportsSnap: true,
  supportsFlatpak: true,
};
