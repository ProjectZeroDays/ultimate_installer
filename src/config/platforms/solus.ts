// Solus Linux configuration
export const solusConfig = {
  detection: {
    id: "solus",
    releaseFile: "/etc/solus-release",
    osRelease: "ID=solus",
    eopkg: "/usr/bin/eopkg",
  },

  // Independent distribution, not based on others
  base: "Independent",
  init: "systemd",
  libc: "glibc",
  compiler: "gcc",
  optimizations: true,

  // eopkg package manager (fork of PiSi from Pardus Linux)
  packageManager: {
    name: "eopkg",
    pythonBased: true,
    install: "eopkg install",
    remove: "eopkg remove",
    update: "eopkg update-repo",
    upgrade: "eopkg upgrade",
    search: "eopkg search",
    info: "eopkg info",
    history: "eopkg history",
    rollback: "eopkg history -t",
    list: "eopkg list-installed",
    clean: "eopkg delete-cache",
    verify: "eopkg check",
  },

  // Repositories
  repositories: {
    polaris: {
      name: "Polaris (Stable)",
      url: "https://cdn.getsol.us/repo/polaris/eopkg-index.xml.xz",
      default: true,
    },
    unstable: {
      name: "Unstable",
      url: "https://cdn.getsol.us/repo/unstable/eopkg-index.xml.xz",
      warning: "For developers and testers only",
    },
  },

  // Build tools
  buildTools: {
    ypkg: "Primary build tool (package.yml)",
    solbuild: "chroot-based build system",
    abiWizard: "ABI compatibility checking",
  },

  // Desktop environments
  desktops: {
    budgie: "Default (Solus-developed)",
    gnome: "GNOME Edition",
    mate: "MATE Edition",
    kde: "KDE Plasma Edition",
    xfce: "XFCE Edition (discontinued)",
  },

  // Package format
  packageFormat: {
    extension: ".eopkg",
    xmlMetadata: true,
    deltaPackages: true,
    automaticDependencies: true,
  },

  // Features
  features: {
    rollingRelease: true,
    curatedRolling: true, // Tested before release
    multiarch: true,
    stateless: true, // /usr is read-only concept
  },

  // Development
  development: {
    packageYml: "package.yml format",
    pspecXml: "Legacy pspec.xml",
    solbuildImages: "/var/lib/solbuild/images",
  },
};

export default solusConfig;