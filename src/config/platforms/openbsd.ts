// OpenBSD configuration - Security-focused BSD
export const openbsdConfig = {
  detection: {
    id: "openbsd",
    uname: "OpenBSD",
    releaseFile: "/etc/openbsd-version",
    sysctl: "kern.version",
  },

  // Security-focused BSD
  base: "BSD 4.4",
  focus: "Security and correctness",
  audit: "Continuous security audit",
  libc: "OpenBSD libc",

  // Package management
  packageManager: {
    name: "pkg_add",
    install: "pkg_add",
    remove: "pkg_delete",
    update: "pkg_add -u",
    fullUpgrade: "sysupgrade",
    search: "pkg_info -Q",
    info: "pkg_info",
    list: "pkg_info",
    locate: "pkg_locate",
  },

  // Ports tree
  ports: {
    location: "/usr/ports",
    make: "make install clean",
    flavors: "FLAVOR=option",
    subpackages: "Multiple packages from one port",
  },

  // System management
  system: {
    rc: "/etc/rc.conf",
    rcLocal: "/etc/rc.local",
    rcShutdown: "/etc/rc.shutdown",
    sysctl: "/etc/sysctl.conf",
  },

  // Security features
  security: {
    pledge: "System call restriction",
    unveil: "Filesystem restriction",
    privSep: "Privilege separation",
    W^X: "Write XOR Execute",
    ASLR: "Address space layout randomization",
    guardPages: "Stack protection",
    securelevels: "Kernel security levels",
  },

  // Networking
  networking: {
    pf: "Packet Filter (PF)",
    pfsync: "PF state synchronization",
    carp: "Common Address Redundancy Protocol",
    relayd: "Load balancer",
    iked: "IKEv2 VPN",
    wireguard: "WireGuard (in kernel)",
    relaydHttp: "HTTP reverse proxy",
  },

  // Crypto
  crypto: {
    libressl: "LibreSSL (OpenSSL fork)",
    openssh: "OpenSSH (developed here)",
    signify: "Signing tool",
    acmeClient: "acme-client for Let's Encrypt",
  },

  // Features
  features: {
    secureByDefault: true,
    noSudoByDefault: "doas preferred",
    xenocara: "X.Org with custom build",
    mandoc: "Documentation system",
    spamd: "Spam deferral daemon",
    OpenSMTPD: "SMTP daemon",
    httpd: "Simple web server",
  },

  // Installation
  installation: {
    ramdisk: "bsd.rd (RAM disk kernel)",
    upgrade: "sysupgrade",
    sets: "base, comp, game, man, xbase, xshare, xserv, xfont",
  },

  // Hardware support
  hardware: {
    platforms: ["amd64", "i386", "arm64", "armv7", "powerpc", "sparc64"],
    best: