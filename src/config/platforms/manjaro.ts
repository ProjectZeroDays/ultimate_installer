// Manjaro Linux configuration - User-friendly Arch
export const manjaroConfig = {
  detection: {
    id: "manjaro",
    releaseFile: "/etc/manjaro-release",
    osRelease: "ID=manjaro",
    mhwd: "/usr/bin/mhwd",
    pamac: "/usr/bin/pamac",
  },

  // Based on Arch Linux
  base: "Arch Linux",
  type: "Rolling release",
  userFriendly: true,
  beginnerFriendly: true,

  // Package management
  packageManager: {
    name: "pacman",
    gui: "pamac",
    install: "pacman -S",
    remove: "pacman -R",
    update: "pacman -Sy",
    upgrade: "pacman -Syu",
    search: "pacman -Ss",
    info: "pacman -Si",
    clean: "pacman -Sc",
  },

  // Pamac (GUI package manager)
  pamac: {
    cli: "pamac install",
    gui: "pamac-manager",
    aur: "pamac build",
    flatpak: "pamac install --flatpak",
    snap: "pamac install --snap",
  },

  // Manjaro Hardware Detection
  mhwd: {
    name: "Manjaro Hardware Detection",
    install: "mhwd -i pci video-nvidia",
    list: "mhwd -l",
    installed: "mhwd -li",
    auto: "Automatic driver installation",
  },

  // Repositories
  repositories: {
    stable: "Stable branch (tested packages)",
    testing: "Testing branch",
    unstable: "Unstable branch (close to Arch)",
    arch: "Arch packages (delayed)",
  },

  // Editions
  editions: {
    xfce: "XFCE (flagship)",
    kde: "KDE Plasma",
    gnome: "GNOME",
    cinnamon: "Cinnamon",
    mate: "MATE",
    budgie: "Budgie",
    i3: "i3",
    sway: "Sway",
    deepin: "Deepin",
    architect: "Architect (CLI installer)",
  },

  // Manjaro tools
  tools: {
    manjaroHello: "Welcome app",
    manjaroSettings: "System settings",
    msm: "Manjaro Settings Manager",
    pamac: "Package manager",
    mhwd: "Hardware detection",
    timeshift: "System snapshots",
  },

  // Features
  features: {
    rolling: "Rolling release",
    stable: "Holds packages for testing",
    kernels: "Multiple kernel support",
    zfs: "ZFS support",
    btrfs: "Btrfs by default",
    timeshift: "Automatic snapshots",
    flatpak: "Built-in Flatpak support",
    snap: "Optional Snap support",
    aur: "AUR access",
  },

  // Installation
  installation: {
    calamares: "Calamares GUI installer",
    architect: "CLI installer",
    manjaroArchitect: "Net install",
  },
};

export default manjaroConfig;