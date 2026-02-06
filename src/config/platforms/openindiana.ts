// OpenIndiana configuration - illumos distribution
export const openindianaConfig = {
  detection: {
    id: "openindiana",
    releaseFile: "/etc/release",
    illumos: "/etc/illumos-release",
    uname: "SunOS",
  },

  // illumos distribution
  base: "illumos",
  fork: "OpenSolaris continuation",
  kernel: "illumos",
  userland: "OpenIndiana",

  // Package management - IPS (Image Packaging System)
  packageManager: {
    name: "pkg",
    fullName: "Image Packaging System",
    publisher: "openindiana.org",
    install: "pkg install",
    uninstall: "pkg uninstall",
    update: "pkg update",
    upgrade: "pkg upgrade",
    search: "pkg search",
    info: "pkg info",
    list: "pkg list",
    history: "pkg history",
    revert: "pkg revert",
    fix: "pkg fix",
    verify: "pkg verify",
  },

  // Repositories
  repositories: {
    hipster: "http://pkg.openindiana.org/hipster",
    hipsterEncumbered: "http://pkg.openindiana.org/hipster-encumbered",
    local: "/var/pkg/repo",
  },

  // Zones (containers)
  zones: {
    global: "Global zone",
    native: "Native zones",
    branded: "Branded zones (Linux, Solaris 10)",
    kernel: "Kernel-level virtualization",
  },

  // ZFS
  zfs: {
    root: "ZFS root by default",
    bootEnvironments: "beadm",
    snapshots: "Automatic",
    compression: "LZ4",
    dedup: "Available",
  },

  // DTrace
  dtrace: {
    available: true,
    dynamicTracing: "Kernel and userland",
    providers: "Many built-in providers",
  },

  // SMF (Service Management Facility)
  smf: {
    services: "svcs",
    enable: "svcadm enable",
    disable: "svcadm disable",
    restart: "svcadm restart",
    config: "svccfg",
    logs: "svcs -L",
  },

  // Crossbow (network virtualization)
  crossbow: {
    vnic: "Virtual NICs",
    etherstub: "Virtual switches",
    flow: "QoS flows",
    zoneExclusive: "Zone-exclusive IP",
  },

  // Features
  features: {
    zfs: "Native ZFS",
    zones: "OS-level virtualization",
    dtrace: "Dynamic tracing",
    smf: "Advanced service management",
    crossbow: "Network virtualization",
    kvm: "KVM for Linux/Windows guests",
    lxBranded: "Linux binary compatibility",
    doors: "Doors IPC mechanism",
  },

  // Development
  development: {
    sunStudio: "Oracle Solaris Studio",
    gcc: "GCC available",
    clang: "Clang available",
    make: "Both make and dmake",
  },

  // Hardware support
  hardware: {
    sparc: "Historical (dropped)",
    x86: "Primary platform",
    drivers: "Solaris driver compatibility",
  },
};

export default openindianaConfig;