// Fedora Linux configuration
export const fedoraConfig = {
  detection: {
    id: "fedora",
    releaseFile: "/etc/fedora-release",
    osRelease: "ID=fedora",
    version: "VERSION_ID",
  },

  // Red Hat community distribution
  base: "Independent (Red Hat sponsored)",
  type: "Community/Enterprise upstream",
  init: "systemd",
  selinux: true,

  // Package management
  packageManager: {
    name: "dnf",
    legacy: "yum (compatibility)",
    install: "dnf install",
    remove: "dnf remove",
    update: "dnf check-update",
    upgrade: "dnf upgrade",
    search: "dnf search",
    info: "dnf info",
    history: "dnf history",
    rollback: "dnf history rollback",
    clean: "dnf clean all",
    autoremove: "dnf autoremove",
  },

  // Repositories
  repositories: {
    fedora: "Fedora (main)",
    updates: "Fedora Updates",
    updatesTesting: "Fedora Updates Testing",
    modular: "Fedora Modular",
    copr: "COPR (user repos)",
    rpmfusion: "RPM Fusion (3rd party)",
    unitedrpms: "UnitedRPMs",
  },

  // Editions
  editions: {
    workstation: "Workstation (GNOME)",
    server: "Server",
    iot: "IoT",
    coreos: "CoreOS (containers)",
    silverblue: "Silverblue (immutable)",
    kinoite: "Kinoite (KDE immutable)",
    sericea: "Sericea (Sway immutable)",
    onyx: "Onyx (Budgie immutable)",
    labs: "Labs (spins)",
  },

  // Spins
  spins: {
    kde: "KDE Plasma",
    xfce: "XFCE",
    lxqt: "LXQt",
    mate: "MATE",
    cinnamon: "Cinnamon",
    lxde: "LXDE",
    i3: "i3",
    soas: "Sugar on a Stick",
  },

  // Features
  features: {
    bleedingEdge: "Latest software",
    selinux: "SELinux by default",
    wayland: "Wayland default (GNOME)",
    btrfs: "Btrfs by default",
    grub2: "GRUB2 bootloader",
    systemd: "systemd init",
    flatpak: "Flatpak integrated",
    toolbox: "Toolbox for development",
    podman: "Podman (rootless containers)",
  },

  // Silverblue/Kinoite
  immutable: {
    rpmOstree: "rpm-ostree",
    layered: "Layered packages",
    base: "Immutable base",
    flatpak: "Apps via Flatpak",
    toolbox: "Development in Toolbox",
  },

  // Development
  development: {
    rawhide: "Rawhide (rolling development)",
    branched: "Branched (beta)",
    updatesTesting: "Test updates",
    koji: "Koji build system",
    bodhi: "Bodhi updates system",
  },

  // Enterprise
  enterprise: {
    rhel: "Red Hat Enterprise Linux downstream",
    centos: "CentOS Stream (upstream of RHEL)",
    oracle: "Oracle Linux",
    alma: "AlmaLinux",
    rocky: "Rocky Linux",
  },

  // Hardware support
  hardware: {
    x86: "Primary",
    arm64: "Supported",
    arm: "Supported",
    ppc64le: "Supported",
    s390x: "Supported",
    riscv: "Emerging",
  },
};

export default fedoraConfig;