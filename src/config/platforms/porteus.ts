// Porteus Linux configuration - Portable Linux
export const porteusConfig = {
  detection: {
    id: "porteus",
    releaseFile: "/etc/porteus-version",
    porteus: "/porteus",
    base: "Slackware",
  },

  // Based on Slackware
  base: "Slackware",
  philosophy: "Always fresh, never install",
  portable: true,
  live: true,

  // Modules system (unique to Porteus)
  modules: {
    format: ".xzm",
    compressed: true,
    unionFs: "AUFS or OverlayFS",
    activate: "activate",
    deactivate: "deactivate",
    load: "Load at boot",
    base: "/porteus/base/",
    modules: "/porteus/modules/",
    optional: "/porteus/optional/",
    rootcopy: "/porteus/rootcopy/",
  },

  // Package management
  packageManager: {
    name: "usm",
    fullName: "Unified Slackware Package Manager",
    slackware: true,
    convert: "Convert to .xzm module",
    download: "Download and convert",
  },

  // Slackware tools also available
  slackware: {
    slackpkg: "slackpkg (if persistent)",
    pkgtools: "installpkg, removepkg, upgradepkg",
  },

  // Persistence
  persistence: {
    changes: "/porteus/changes/",
    saveSession: "Save changes on exit",
    cheatcodes: "Boot parameters",
    alwaysFresh: "No persistence mode",
  },

  // Boot modes
  bootModes: {
    alwaysFresh: "Always Fresh",
    copyToRam: "Copy To RAM",
    changes: "Save changes",
    changesExit: "Save changes on exit",
  },

  // Cheatcodes
  cheatcodes: {
    config: "/boot/syslinux/porteus.cfg",
    examples: [
      "changes=/porteus/",
      "copy2ram",
      "toroot",
      "login=",
      "passwd=",
    ],
  },

  // Editions
  editions: {
    cinnamon: "Cinnamon",
    mate: "MATE",
    xfce: "XFCE",
    kde: "KDE",
    lxde: "LXDE",
    lxqt: "LXQt",
    openbox: "Openbox",
  },

  // Features
  features: {
    modular: true,
    portable: true,
    frugal: true,
    fast: true,
    noInstall: "Runs from USB/CD",
  },
};

export default porteusConfig;