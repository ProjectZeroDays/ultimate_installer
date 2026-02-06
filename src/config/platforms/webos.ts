// webOS (LG Smart TV) configuration
export const webosConfig = {
  detection: {
    id: "webos",
    releaseFile: "/etc/webos-release",
    starfish: "/usr/bin/starfish", // webOS service binary
    lunaService: "/usr/bin/luna-send",
  },

  // webOS is based on Open webOS (formerly HP/Palm)
  base: "Open webOS",
  kernel: "Linux",
  init: "systemd",

  // Package management via opkg (from OpenEmbedded)
  packageManager: {
    name: "opkg",
    install: "opkg install",
    remove: "opkg remove",
    update: "opkg update",
    upgrade: "opkg upgrade",
    search: "opkg find",
    info: "opkg info",
    list: "opkg list-installed",
  },

  // Repositories
  repositories: {
    official: "http://repo.webosbrew.org",
    lg: "http://lgappstv.com",
    homebrew: "http://repo.webosbrew.org",
  },

  // Homebrew support (webosbrew)
  homebrew: {
    enabled: true,
    installer: "org.webosbrew.hbchannel",
    service: "org.webosbrew.hbchannel.service",
    rootRequired: true,
  },

  // Development
  development: {
    sdk: "webOS TV SDK",
    cli: "ares",
    emulator: "webOS TV Emulator",
    inspector: "Web Inspector",
  },

  // Services (Luna bus)
  services: {
    luna: "com.webos.service",
    config: "com.webos.service.config",
    downloadmanager: "com.webos.service.downloadmanager",
    notification: "com.webos.service.notification",
    settings: "com.webos.service.settings",
  },

  // Apps
  apps: {
    ipk: "webOS application package",
    install: "luna-send -n 1 luna://com.webos.appInstallService/install",
    remove: "luna-send -n 1 luna://com.webos.appInstallService/remove",
  },

  // Limitations
  limitations: {
    rootAccess: "Requires rooting/jailbreaking",
    officialStore: "LG Content Store only",
    sideloading: "Limited without developer mode",
  },
};

export default webosConfig;