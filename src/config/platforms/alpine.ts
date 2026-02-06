import { PlatformConfig } from "../schema.ts";

export const alpine: PlatformConfig = {
  id: "alpine",
  name: "Alpine Linux",
  family: "alpine",
  packageManager: "apk",
  isSecurityFocused: false,
  isPrivacyFocused: false,
  supportedArchitectures: ["x64", "arm64", "arm"],
  defaultRepos: [
    "https://dl-cdn.alpinelinux.org/alpine/latest-stable/main",
    "https://dl-cdn.alpinelinux.org/alpine/latest-stable/community",
  ],
  installCommand: "apk add",
  uninstallCommand: "apk del",
  updateCommand: "apk update",
  upgradeCommand: "apk upgrade",
  searchCommand: "apk search",
  infoCommand: "apk info",
  cleanCommand: "apk cache clean",
  needsSudo: true,
};
