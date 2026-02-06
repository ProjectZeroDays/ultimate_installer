// Gentoo Linux configuration - Source-based meta distribution
export const gentooConfig = {
  // Detection
  detection: {
    id: "gentoo",
    releaseFile: "/etc/gentoo-release",
    makeConf: "/etc/portage/make.conf",
    portageDir: "/etc/portage",
  },

  // Portage package management
  portage: {
    emerge: "emerge",
    sync: "emerge --sync",
    world: "emerge --update --deep --newuse @world",
    search: "emerge -s",
    info: "emerge -pv",
    clean: "emerge --depclean",
    config: "etc-update",
  },

  // Configuration files
  config: {
    makeConf: "/etc/portage/make.conf",
    packageUse: "/etc/portage/package.use",
    packageAcceptKeywords: "/etc/portage/package.accept_keywords",
    packageLicense: "/etc/portage/package.license",
    packageMask: "/etc/portage/package.mask",
    packageUnmask: "/etc/portage/package.unmask",
    reposConf: "/etc/portage/repos.conf",
  },

  // Repositories
  repos: {
    gentoo: {
      syncType: "rsync",
      uri: "rsync://rsync.gentoo.org/gentoo-portage",
    },
    layman: "/var/lib/layman",
    local: "/usr/local/portage",
  },

  // Profiles
  profiles: {
    default: "/etc/portage/make.profile",
    desktop: "default/linux/amd64/17.1/desktop",
    server: "default/linux/amd64/17.1/server",
    hardened: "hardened/linux/amd64",
    musl: "default/linux/amd64/17.0/musl",
    selinux: "hardened/linux/amd64/selinux",
  },

  // USE flags
  useFlags: {
    global: "/etc/portage/make.conf",
    perPackage: "/etc/portage/package.use",
    common: ["-systemd", "pulseaudio", "alsa", "X", "gtk", "qt5", "unicode"],
  },

  // Make options
  makeopts: {
    jobs: "MAKEOPTS=\"-j4\"",
    loadAverage: "MAKEOPTS=\"-l4\"",
    emergeDefaultOpts: "--jobs --load-average",
  },

  // Essential tools
  essentialPackages: [
    "app-portage/gentoolkit",
    "app-portage/eix",
    "app-portage/portage-utils",
    "app-portage/layman",
    "app-admin/sudo",
    "sys-process/cronie",
    "sys-apps/mlocate",
    "app-shells/bash-completion",
  ],

  // Kernel
  kernel: {
    gentooSources: "sys-kernel/gentoo-sources",
    genkernel: "sys-kernel/genkernel",
    config: "/usr/src/linux/.config",
    manual: true,
  },

  // Features
  features: {
    sourceBased: true,
    compileEverything: true,
    useFlags: true,
    ccache: true,
    distcc: true,
    binpkgs: false, // Can be enabled
  },
};

export default gentooConfig;