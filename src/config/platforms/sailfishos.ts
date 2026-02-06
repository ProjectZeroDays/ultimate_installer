// Sailfish OS configuration - Mobile Linux from Jolla
export const sailfishosConfig = {
  // Detection
  detection: {
    id: "sailfishos",
    releaseFile: "/etc/sailfishos-release",
    ssuConfig: "/etc/ssu/ssu.ini",
    osRelease: "/etc/os-release",
  },

  // SSU (Secure Software Updates) configuration
  ssu: {
    command: "ssu",
    domain: "sailfish",
    release: "latest",
    repos: "/usr/share/ssu/repos.ini",
    updateRepos: "ssu ur",
  },

  // Package management
  packages: {
    manager: "zypper",
    install: "pkcon install",
    remove: "pkcon remove",
    update: "pkcon refresh",
    upgrade: "pkcon update",
    search: "pkcon search",
  },

  // Essential packages
  essentialPackages: [
    "sailfishsilica-qt5",
    "lipstick-qt5",
    "nemo-qml-plugin-configuration",
    "nemo-qml-plugin-notifications",
    "nemo-qml-plugin-contacts",
    "nemo-qml-plugin-calendar",
    "mlite",
    "mapplauncherd",
  ],

  // UI Framework
  ui: {
    framework: "Silica",
    qtVersion: "5.6",
    compositor: "lipstick",
    launcher: "mapplauncherd",
  },

  // Development
  development: {
    sdk: "Sailfish SDK",
    target: "SailfishOS-4.5.0.18",
    tools: ["sfdk", "mb2", "mic"],
    emulator: "Sailfish Emulator",
  },

  // Hardware adaptation
  hadk: {
    buildTools: ["Platform SDK", "HADK"],
    androidBase: "LineageOS 18.1", // or AOSP
    hybris: "libhybris",
  },

  // Services
  services: {
    accounts: "buteo-syncfw",
    sync: "msyncd",
    backup: "vault",
    store: "harbour-storeman", // or Jolla Store
  },

  // Community
  community: {
    openRepos: "https://openrepos.net",
    chum: "https://chumrpm.net",
    warehouse: "harbour-warehouse",
  },
};

export default sailfishosConfig;