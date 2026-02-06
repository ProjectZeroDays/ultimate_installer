// Raspbian / Raspberry Pi OS configuration
export const raspbianConfig = {
  detection: {
    id: "raspbian",
    idNew: "debian", // Newer versions show as debian
    releaseFile: "/etc/rpi-issue",
    osRelease: "PRETTY_NAME.*Raspberry Pi",
    deviceTree: "/proc/device-tree/model",
    configTxt: "/boot/config.txt",
    cmdlineTxt: "/boot/cmdline.txt",
  },

  // Raspberry Pi hardware
  hardware: {
    models: [
      "Zero", "Zero W", "Zero 2 W",
      "1 Model A", "1 Model B",
      "2 Model B",
      "3 Model A+", "3 Model B", "3 Model B+",
      "4 Model B", "400",
      "5",
    ],
    architectures: ["armv6", "armv7", "armv8/arm64"],
    gpio: true,
    camera: true,
    display: ["HDMI", "DSI", "Composite"],
  },

  // Based on Debian
  base: "Debian",
  variants: {
    full: "Raspberry Pi OS with desktop and recommended software",
    desktop: "Raspberry Pi OS with desktop",
    lite: "Raspberry Pi OS Lite (no desktop)",
  },

  // Package management
  packageManager: {
    name: "apt",
    install: "apt install",
    remove: "apt remove",
    update: "apt update",
    upgrade: "apt full-upgrade", // Recommended over apt upgrade
    autoremove: "apt autoremove",
    clean: "apt clean",
  },

  // Raspberry Pi specific tools
  tools: {
    raspiConfig: "raspi-config",
    raspiBackup: "rpi-backup",
    raspiIm