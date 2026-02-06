// Qubes OS configuration - Security-focused Xen-based OS
export const qubesConfig = {
  // Detection
  detection: {
    qubes: "/etc/qubes-release",
    xen: "/sys/hypervisor/type",
    qubesdb: "/usr/bin/qubesdb-read",
    version: "/etc/qubes-version",
  },

  // Architecture
  architecture: {
    type: "xen",
    dom0: "Domain 0",
    hypervisor: "Xen",
    virtualization: "paravirtualization",
  },

  // qubes (VMs)
  qubes: {
    dom0: {
      name: "dom0",
      type: "admin",
      network: false,
      gui: true,
    },
    templates: {
      fedora: "fedora-38",
      debian: "debian-12",
      whonix: "whonix-17",
      minimal: "debian-12-minimal",
    },
    sys: {
      net: "sys-net",
      firewall: "sys-firewall",
      usb: "sys-usb",
      whonix: "sys-whonix",
    },
  },

  // Security
  security: {
    isolation: true,
    disposable: true,
    splitGpg: true,
    splitSsh: true,
    u2fProxy: true,
    secureDrop: true,
    antiEvilMaid: true,
  },

  // Networking
  networking: {
    proxy: "sys-firewall",
    tor: "sys-whonix",
    vpn: "sys-vpn",
    mirage: "sys-net-mirage",
  },

  // Storage
  storage: {
    pools: "qvm-pool",
    lvm: "qubes_dom0",
    thin: "thin_pool",
    encryption: "luks",
  },

  // Tools
  tools: {
    qvm: "qvm-*",
    qubesPrefs: "qubes-prefs",
    qubesDom0Update: "qubes-dom0-update",
    qubesCtl: "qubesctl",
  },

  // SaltStack integration
  salt: {
    enabled: true,
    top: "/srv/salt/top.sls",
    state: "qubesctl state.highstate",
  },

  // GUI
  gui: {
    manager: "Qubes Manager",
    domains: "Qubes Domain Manager",
    settings: "Qubes Settings",
    fileCopy: "qvm-copy-to-vm",
    fileMove: "qvm-move-to-vm",
  },

  // Development
  development: {
    builder: "qubes-builder",
    templateBuilder: "qubes-template-builder",
    kernel: "qubes-linux-kernel",
  },
};

export default qubesConfig;