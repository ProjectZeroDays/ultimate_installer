// Void Linux configuration - Independent, rolling release
export const voidConfig = {
  // Detection
  detection: {
    id: "void",
    releaseFile: "/etc/void-release",
    osRelease: "/etc/os-release",
  },

  // Package management
  xbps: {
    install: "xbps-install -S",
    remove: "xbps-remove",
    query: "xbps-query",
    reconfigure: "xbps-reconfigure",
    alternatives: "xbps-alternatives",
    src: "xbps-src",
  },

  // Repositories
  repos: {
    main: "https://repo-default.voidlinux.org/current",
    multilib: "https://repo-default.voidlinux.org/current/multilib",
    nonfree: "https://repo-default.voidlinux.org/current/nonfree",
    debug: "https://repo-default.voidlinux.org/current/debug",
  },

  // Init system
  init: {
    system: "runit",
    serviceDir: "/etc/sv",
    enabledDir: "/var/service",
    logDir: "/var/log",
  },

  // Essential packages
  essentialPackages: [
    "base-system",
    "void-repo-nonfree",
    "void-repo-multilib",
    "void-repo-multilib-nonfree",
  ],

  // Services
  services: {
    enable: "ln -s /etc/sv/<service> /var/service",
    disable: "rm /var/service/<service>",
    start: "sv start",
    stop: "sv stop",
    restart: "sv restart",
    status: "sv status",
  },

  // musl vs glibc
  libc: {
    default: "glibc",
    musl: "void-linux-musl",
  },

  // Development
  development: {
    xbpsSrc: "/usr/src/xbps-src",
    templates: "/usr/src/xbps-src/srcpkgs",
  },

  // Features
  features: {
    rollingRelease: true,
    runit: true,
    muslOption: true,
    libressl: true, // Historically, now OpenSSL
    noSystemd: true,
  },
};

export default voidConfig;