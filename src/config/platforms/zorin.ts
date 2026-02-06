// Zorin OS specific configuration
export const zorinConfig = {
  // Zorin uses Ubuntu LTS as base
  repositories: {
    ubuntu: "http://archive.ubuntu.com/ubuntu",
    zorin: "https://packages.zorinos.com",
  },

  // Zorin specific packages
  essentialPackages: [
    "zorin-desktop-2",
    "zorin-appearance",
    "zorin-connect",
    "zorin-auto-theme",
    "zorin-os-pro",
    "zorin-os-pro-wallpapers",
    "zorin-os-pro-layouts",
  ],

  // Zorin specific tweaks
  tweaks: {
    enableZorinConnect: true,  // KDE Connect fork
    setupThemeSwitching: true,
    enableLayoutSwitcher: true,
    setupWindowsAppSupport: true,
  },

  // Zorin layouts
  layouts: [
    "default",
    "windows",
    "macos",
    "ubuntu",
    "touch",
  ],

  // Pro features (if available)
  proFeatures: {
    enable: false,  // Requires license
    layouts: ["windows-pro", "macos-pro", "ubuntu-pro"],
    software: ["photoshop-alternative", "video-editing"],
  },
};

export default zorinConfig;