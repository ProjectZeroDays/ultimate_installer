import { PlatformConfig } from "../schema.ts";

export const arch: PlatformConfig = {
  id: "arch",
  name: "Arch Linux",
  family: "arch",
  packageManager: "pacman",
  isSecurityFocused: false,
  isPrivacyFocused: false,
  supportedArchitectures: ["x64", "arm64"],
  defaultRepos: [],
  installCommand: "pacman -S --noconfirm",
  uninstallCommand: "pacman -R --noconfirm",
  updateCommand: "pacman -Sy",
  upgradeCommand: "pacman -Syu --noconfirm",
  searchCommand: "pacman -Ss",
  infoCommand: "pacman -Si",
  cleanCommand: "pacman -Sc --noconfirm",
  needsSudo: true,
  supportsAUR: true,
};
