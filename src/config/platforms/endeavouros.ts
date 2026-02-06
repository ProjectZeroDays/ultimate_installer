// EndeavourOS specific configuration (Arch-based)
export const endeavourConfig = {
  // EndeavourOS uses Arch repositories plus their own
  repositories: {
    arch: "https://geo.mirror.pkgbuild.com/$repo/os/$arch",
    endeavouros: "https://mirror.alpix.eu/endeavouros/repo/$repo/$arch",
  },

  // EndeavourOS specific packages
  essentialPackages: [
    "endeavouros-keyring",
    "endeavouros-mirrorlist",
    "endeavouros-theming",
    "eos-apps-info",
    "eos-hooks",
    "eos-log-tool",
    "eos-packagelist",
    "eos-plasma-sddm-config",
    "eos-rankmirrors",
    "eos-update-notifier",
    "welcome",
    "reflector-simple",
    "yad-eos",
  ],

  // Desktop environments
  desktopEnvironments: [
    "xfce4",
    "kde",
    "gnome",
    "i3",
    "sway",
    "bspwm",
    "cinnamon",
    "mate",
    "lxqt",
  ],

  // EndeavourOS specific tweaks
  tweaks: {
    setupMirrorRanking: true,
    enableUpdateNotifier: true,
    setupWelcomeApp: true,
    enableLogTool: true,
  },

  // Installation tools
  installTools: {
    calamaris: true,          // Installer
    reflector: true,          // Mirror ranking
    yay: true,                // AUR helper
  },
};

export default endeavourConfig;