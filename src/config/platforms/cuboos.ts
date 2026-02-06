// CuboOS configuration
// Note: This is a template based on common Linux distribution patterns
// Update these values based on actual CuboOS specifications

export const cuboosConfig = {
  // Detection
  detection: {
    id: "cuboos",
    versionFile: "/etc/cuboos-version",
    releaseFile: "/etc/cuboos-release",
  },

  // Repositories (update with actual CuboOS repositories)
  repositories: {
    main: "https://repo.cuboos.org/main",
    community: "https://repo.cuboos.org/community",
    testing: "https://repo.cuboos.org/testing",
  },

  // Package manager (update based on actual package manager)
  packageManager: {
    name: "apt", // or "pacman", "dnf", etc.
    install: "apt install -y",
    update: "apt update",
    upgrade: "apt upgrade -y",
  },

  // Essential packages
  essentialPackages: [
    "cuboos-base",
    "cuboos-desktop",
    "cuboos-tools",
    // Add CuboOS specific packages
  ],

  // System configuration
  system: {
    initSystem: "systemd", // or "openrc", "runit"
    defaultShell: "bash",
    defaultEditor: "nano",
  },

  // Desktop environment
  desktop: {
    default: "cuboos-desktop",
    available: ["cuboos-desktop", "cuboos-lite"],
  },

  // Hardware support
  hardware: {
    autoDetect: true,
    firmware: true,
    proprietaryDrivers: false,
  },

  // Security
  security: {
    selinux: false,
    apparmor: true,
    firewall: "ufw",
  },

  // Updates
  updates: {
    automatic: false,
    checkDaily: true,
    kernelUpdates: true,
  },
};

export default cuboosConfig;