// Garuda Linux specific configuration (Arch-based)
export const garudaConfig = {
  // Garuda uses Arch repositories plus Chaotic AUR
  repositories: {
    arch: "https://geo.mirror.pkgbuild.com/$repo/os/$arch",
    chaotic: "https://cdn-mirror.chaotic.cx/$repo/$arch",
    garuda: "https://builds.garudalinux.org/repos/$repo/$arch",
  },

  // Garuda specific packages
  essentialPackages: [
    "garuda-common-settings",
    "garuda-hooks",
    "garuda-migrations",
    "garuda-network-assistant",
    "garuda-settings-manager",
    "garuda-system-maintenance",
    "garuda-video-linux-config",
    "garuda-welcome",
    "garuda-boot-options",
    "garuda-assistant",
    "garuda-gamer",
    "garuda-libs",
  ],

  // Desktop environments offered by Garuda
  desktopEnvironments: [
    "garuda-dr460nized",      // KDE Plasma
    "garuda-bspwm",
    "garuda-i3",
    "garuda-sway",
    "garuda-xfce",
    "garuda-lxqt-kwin",
    "garuda-cinnamon",
    "garuda-mate",
    "garuda-gnome",
  ],

  // Garuda specific tweaks
  tweaks: {
    enablePerformanceMode: true,
    enable BTRFS: true,
    enableTimeshift: true,
    setupZRAM: true,
    enableAnanicy: true,      // Process scheduler
    enableCPUScheduler: true,
  },

  // Gaming optimizations
  gaming: {
    enableSteam: true,
    enableProtonGE: true,     // Proton GloriousEggroll
    enableLutris: true,
    enableGameMode: true,
    enableMangoHud: true,
  },

  // Chaotic AUR packages commonly used
  chaoticAur: [
    "proton-ge-custom",
    "mangohud",
    "goverlay",
    "heroic-games-launcher-bin",
    "prismlauncher",
  ],
};

export default garudaConfig;