// NetBSD configuration - Portable BSD
export const netbsdConfig = {
  detection: {
    id: "netbsd",
    uname: "NetBSD",
    releaseFile: "/etc/release",
    sysctl: "kern.version",
  },

  // Portability-focused BSD
  base: "BSD 4.4",
  focus: "Portability and clean design",
  slogan: "Of course it runs NetBSD",
  kernel: "Modular kernel",

  // Package management - pkgsrc
  packageManager: {
    name: "pkgin",
    fullName: "pkgin (binary packages)",
    install: "pkgin install",
    remove: "pkgin remove",
    update: "pkgin update",
    upgrade: "pkgin full-upgrade",
    search: "pkgin search",
    show: "pkgin show",
    list: "pkgin list",
    clean: "pkgin clean",
    autoremove: "pkgin autoremove",
  },

  // pkgsrc (portable package collection)
  pkgsrc: {
    location: "/usr/pkgsrc",
    make: "bmake",
    install: "make install",
    bulkBuild: "pbulk",
    joyent: "Joyent SmartOS binaries",
  },

  // Binary packages
  binaries: {
    official: "Limited",
    joyent: "Joyent provides binaries",
    buildFromSource: "Common",
  },

  // Portability
  ports: {
    amd64: "Tier 1",
    i386: "Tier 1",
    arm: "Tier 2",
    arm64: "Tier 2",
    mips: "Many variants",
    powerpc: "Multiple variants",
    sparc: "UltraSPARC",
    vax: "Historical",
    m68k: "Historical",
    sh3: "Dreamcast",
    alpha: "Historical",
    hppa: "Historical",
    riscv64: "Emerging",
  },

  // Features
  features: {
    rumpKernel: "Userspace kernel components",
    kernelModules: "LKM (Loadable Kernel Modules)",
    veriexec: "Verified execution",
    kauth: "Kernel authorization",
    npf: "New Packet Filter",
    zfs: "Experimental",
    dtrace: "Available",
    lua: "Lua in kernel",
  },

  // Rump kernel
  rump: {
    description: "Run kernel drivers in userspace",
    anykernel: "Anykernel architecture",
    use: "Testing, drivers, filesystems",
  },

  // System