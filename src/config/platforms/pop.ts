// Pop!_OS specific configuration
export const popConfig = {
  // Pop!_OS uses Ubuntu repositories plus System76 repos
  repositories: {
    ubuntu: "http://us.archive.ubuntu.com/ubuntu",
    system76: "http://apt.pop-os.org/release",
    proprietary: "http://apt.pop-os.org/proprietary",
  },

  // Pop!_OS specific packages
  essentialPackages: [
    "pop-desktop",
    "pop-default-settings",
    "pop-shell",
    "pop-gnome-shell-theme",
    "pop-icon-theme",
    "pop-theme",
    "system76-driver",
    "system76-power",
    "system76-firmware",
    "firmware-manager",
    "hidpi-daemon",
  ],

  // Pop!_OS specific tweaks
  tweaks: {
    enablePopShell: true,      // Tiling window manager
    enableAutoTiling: true,
    setupHiDPI: true,
    enableFirmwareUpdates: true,
  },

  // Development tools favored by Pop!_OS
  devTools: [
    "popsicle",           // USB flasher
    "sideload",           // Flatpak installer
    "shop",               // Pop!_Shop
  ],

  // Gaming support (Pop!_OS is popular for gaming)
  gaming: {
    enableSteam: true,
    enableLutris: true,
    enableGameMode: true,
    nvidiaDrivers: true,
  },
};

export default popConfig;