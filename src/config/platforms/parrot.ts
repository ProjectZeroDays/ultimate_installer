// Parrot OS configuration - Security-focused Debian-based distribution
export const parrotConfig = {
  detection: {
    id: "parrot",
    releaseFile: "/etc/parrot-version",
    osRelease: "ID=parrot",
    version: "VERSION_ID",
  },

  // Based on Debian Testing
  base: "Debian Testing",
  security: true,
  privacy: true,
  forensics: true,
  development: true,

  // Editions
  editions: {
    security: "Security (full pentesting)",
    home: "Home (standard desktop)",
    kde: "KDE Plasma edition",
    xfce: "XFCE edition",
    mate: "MATE edition",
    architect: "Architect (CLI installer)",
    cloud: "Cloud/Server",
  },

  // Package management
  packageManager: {
    name: "apt",
    parrotUpgrade: "parrot-upgrade",
    install: "apt install",
    remove: "apt remove",
    update: "apt update",
    upgrade: "apt upgrade",
    fullUpgrade: "apt full-upgrade",
    parrotMirror: "parrot-mirror",
  },

  // Parrot repositories
  repositories: {
    core: "deb https://deb.parrot.sh/parrot parrot main contrib non-free",
    security: "deb https://deb.parrot.sh/parrot parrot-security main contrib non-free",
    backports: "deb https://deb.parrot.sh/parrot parrot-backports main contrib non-free",
  },

  // Security tools
  securityTools: {
    metapackages: [
      "parrot-tools-full",
      "parrot-tools-information-gathering",
      "parrot-tools-vulnerability",
      "parrot-tools-exploitation",
      "parrot-tools-post-exploitation",
      "parrot-tools-forensics",
      "parrot-tools-wireless",
      "parrot-tools-web",
      "parrot-tools-sniff",
      "parrot-tools-password",
      "parrot-tools-reversing",
      "parrot-tools-social-engineering",
      "parrot-tools-crypto",
      "parrot-tools-dos",
    ],
    anonsurf: "parrot-tools-anonsurf",
  },

  // AnonSurf (anonymity)
  anonsurf: {
    enabled: true,
    start: "anonsurf start",
    stop: "anonsurf stop",
    change: "anonsurf change",
    myip: "anonsurf myip",
    tor: "Tor-based anonymization",
  },

  // Forensics
  forensics: {
    mode: "Forensics mode available",
    noMount: "Doesn't mount disks by default",
    tools: "Full forensic toolkit",
  },

  // Development tools
  development: {
    docker: true,
    podman: true,
    vscodium: "VSCodium (privacy-respecting VS Code)",
    compilers: "Full build toolchain",
  },

  // Features
  features: {
    rolling: "Rolling release (based on Debian Testing)",
    sandboxed: "Firejail sandboxing",
    hardened: "Kernel hardening",
    apparmor: "AppArmor enabled",
    secureBoot: "Secure Boot support",
  },

  // Installation
  installation: {
    installer: "Calamares",
    alternate: "parrot-install.sh for Debian conversion",
    arm: "ARM64 support",
  },
};

export default parrotConfig;