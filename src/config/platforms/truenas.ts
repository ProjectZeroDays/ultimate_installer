// TrueNAS CORE/SCALE configuration
export const truenasConfig = {
  // Detection
  detection: {
    core: "/etc/version", // TrueNAS CORE (FreeBSD-based)
    scale: "/etc/truenas", // TrueNAS SCALE (Linux-based)
    version: "/etc/version",
    webui: "http://192.168.1.1",
  },

  // Edition detection
  edition: {
    core: "TrueNAS CORE", // FreeBSD-based
    scale: "TrueNAS SCALE", // Debian-based
    enterprise: "TrueNAS Enterprise",
  },

  // Package management (SCALE only)
  packages: {
    manager: "apt", // SCALE only
    update: "apt update",
    install: "apt install",
    middleware: "midclt",
  },

  // Storage
  storage: {
    zfs: true,
    pools: "/mnt",
    datasets: "zfs list",
    snapshots: "zfs list -t snapshot",
    scrubs: "zpool scrub",
  },

  // Services
  services: {
    smb: "smb.service",
    nfs: "nfs-server.service",
    iscsi: "iscsi.service",
    ftp: "proftpd.service",
    webdav: "webdav.service",
    s3: "minio.service",
  },

  // Sharing
  sharing: {
    smb: { enabled: true, config: "/etc/smb4.conf" },
    nfs: { enabled: true, exports: "/etc/exports" },
    iscsi: { enabled: true, config: "/etc/ctl.conf" },
    afp: { enabled: false }, // Deprecated
  },

  // Networking
  network: {
    interfaces: "ip link",
    lagg: "link aggregation",
    vlan: "802.1q",
    bridge: "bridge",
    routes: "ip route",
  },

  // Virtualization
  virtualization: {
    kvm: true, // SCALE only
    bhyve: true, // CORE only
    docker: true, // SCALE only
    kubernetes: true, // SCALE only
    vms: "/mnt/tank/vms",
  },

  // Applications (SCALE only)
  apps: {
    catalog: "https://github.com/truenas/charts",
    docker: true,
    kubernetes: true,
    helm: true,
  },

  // System
  system: {
    hostname: "truenas",
    timezone: "UTC",
    ntp: ["0.pool.ntp.org", "1.pool.ntp.org"],
    email: {
      smtp: false,
      from: "truenas@localhost",
      to: "admin@localhost",
    },
  },

  // Security
  security: {
    rootLogin: false, // Disabled by default in newer versions
    twoFactor: true,
    certificates: "/etc/certificates",
    acme: true,
  },

  // Tasks
  tasks: {
    scrubs: "zpool scrub",
    snapshots: "zfs snapshot",
    replications: "zfs send/receive",
    cloudSync: "rclone",
    rsync: "rsync",
  },

  // API
  api: {
    websocket: "ws://192.168.1.1/websocket",
    rest: "http://192.168.1.1/api/v2.0",
    docs: "http://192.168.1.1/api/docs",
  },
};

export default truenasConfig;