import { PlatformConfig } from "../schema.ts";

export const ish: PlatformConfig = {
  id: "ish",
  name: "iSH (iOS)",
  family: "alpine",
  packageManager: "apk",
  isSecurityFocused: false,
  isPrivacyFocused: false,
  supportedArchitectures: ["x86"],
  isMobile: true,
  defaultRepos: [
    "https://dl-cdn.alpinelinux.org/alpine/edge/main",
    "https://dl-cdn.alpinelinux.org/alpine/edge/community",
  ],
  installCommand: "apk add",
  uninstallCommand: "apk del",
  updateCommand: "apk update",
  upgradeCommand: "apk upgrade",
  searchCommand: "apk search",
  infoCommand: "apk info",
  cleanCommand: "apk cache clean",
  needsSudo: false,
  paths: {
    installDir: "/opt/ultimate-installer",
    binDir: "/usr/local/bin",
    configDir: "/root/.config/ultimate-installer",
    cacheDir: "/tmp/ui-cache",
  },
};
