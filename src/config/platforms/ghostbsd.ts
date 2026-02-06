// GhostBSD configuration - Desktop FreeBSD
export const ghostbsdConfig = {
  detection: {
    id: "ghostbsd",
    releaseFile: "/etc/ghostbsd-version",
    osRelease: "ID=ghostbsd",
    ghostbsd: "/usr/local/bin/ghostbsd",
  },

  // Based on FreeBSD
  base: "FreeBSD",
  type: "Desktop-oriented",
  init: "OpenRC", // Not FreeBSD init
  userFriendly: true,

  // Package management
  packageManager: {
    name: "pkg",
    install: "pkg install",
    remove: "pkg delete",
    update: "pkg update",
    upgrade: "pkg upgrade",
    search: "pkg search",
    info: "pkg info",
  },

  // GhostBSD-specific tools
  tools: {
    ghostbsdUpdate: "ghostbsd-update",
    ghostbsdSrc: "ghostbsd-src",
    stationTweak: "station-tweak",
    updateManager: "Update Station",
    softwareStation: "Software Station",
    networkMgr: "NetworkMgr",
  },

  // Update Station
  updateStation: {
    gui: true,
    systemUpdates: "FreeBSD base updates",
    pkgUpdates: "Package updates",
    kernel: "Kernel updates",
  },

  // Software Station
  softwareStation: {
    gui: true,
    pkgBackend: "pkg",
    categories: true,
    search: true,
    installed: "Installed packages tab",
  },

  // Desktop environments
  desktops: {
    mate: "MATE (default)",
    xfce: "XFCE",
   