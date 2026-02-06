// Haiku OS configuration - BeOS successor
export const haikuConfig = {
  detection: {
    id: "haiku",
    uname: "Haiku",
    releaseFile: "/boot/system/settings/etc/os-release",
    finddir: "/bin/finddir",
  },

  // BeOS successor
  base: "BeOS 5",
    kernel: "NewOS/Haiku kernel",
    userland: "Haiku",
    language: "C++",

  // Package management
  packageManager: {
    name: "pkgman",
    install: "pkgman install",
    uninstall: "pkgman uninstall",
    update: "pkgman update",
    refresh: "pkgman refresh",
    search: "pkgman search",
    fullSync: "pkgman full-sync",
    resolve: "pkgman resolve",
  },

  // HaikuDepot (GUI)
  depot: {
    name: "HaikuDepot",
    gui: true,
    server: "depot.haiku-os.org",
    local: "/boot/system/cache/package-repositories/",
  },

  // Package format
  packages: {
    format: ".hpkg",
    state: "Activated/Deactivated",
    location: "/boot/system/packages/",
    userLocation: "/boot/home/config/packages/",
    stateDir: "/boot/system/package-states/",
  },

  // File system
  filesystem: {
    bfs: "Be File System",
    attributes: "Extended attributes",
    queries: "Live queries",
    indexing: "Automatic indexing",
    databaseLike: "Database-like filesystem",
  },

  // Directory structure
  directories: {
    system: "/boot/system/",
    home: "/boot/home/",
    config: "/boot/home/config/",
    apps: "/boot/system/apps/",
    preferences: "/boot/system/preferences/",
  },

  // API
  api: {
    kits: "Application Kit, Interface Kit, Storage Kit, etc.",
    objectOriented: "C++ object-oriented",
    messaging: "Message-passing",
    multithreading: "Pervasive multithreading",
  },

  // Features
  features: {
    responsive: "Highly responsive UI",
    webPositive: "WebPositive browser",
    mail: "Mail application",
    mediaPlayer: "MediaPlayer",
    deskbar: "Deskbar (taskbar)",
    replicants: "Replicants (desktop widgets)",
    workspaces: "Virtual workspaces",
    partialPosix: "Partial POSIX compatibility",
  },

  // Hardware support
  hardware: {
    x86: "Primary platform",
    x86_64: "Available",
    arm: "In development",
    riscV: "In development",
    drivers: "Limited but growing",
  },

  // Status
  status: {
    beta: "R1/B