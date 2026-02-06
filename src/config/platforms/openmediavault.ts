// OpenMediaVault configuration - Debian-based NAS
export const openmediavaultConfig = {
  detection: {
    id: "openmediavault",
    releaseFile: "/etc/openmediavault-release",
    omv: "/usr/share/openmediavault",
    config: "/etc/openmediavault/config.xml",
  },

  // Based on Debian
  base: "Debian",
  type: "Network Attached Storage (NAS)",
  web: "Web-based administration",

  // Package management
  packageManager: {
    name: "apt",
    omvExtras: "omv-extras.org",
    install: "apt install",
    remove: "apt remove",
    update: "apt update",
    upgrade: "apt upgrade",
    omvUpdate: "omv-update",
  },

  // Web interface
  web: {
    url: "http://192.168.1.100",
    port: 80,
    httpsPort: 443,
    user: "admin",
    defaultPassword: "openmediavault",
  },

  // Storage
  storage: {
    filesystems: ["ext4", "xfs", "btrfs", "zfs", "exfat", "ntfs"],
    raid: ["JBOD", "0", "1", "5", "6", "10"],
    lvm: true,
    encryption: "LUKS",
    snapraid: "Plugin available",
    mergerfs: "Plugin available",
  },

  // Services
  services: {
    samba: "SMB/CIFS",
    nfs: "NFSv3/v4",
    ftp: "ProFTPD",
    rsync: "Rsync server",
    afp: "Netatalk (deprecated)",
    dlna: "MiniDLNA",
    plex: "Plugin",
    nextcloud: "Plugin",
    docker: "Plugin",
    kvm: "Plugin",
    wireguard: "Plugin",
  },

  // Plugins (omv-extras)
  plugins: {
    source: "omv-extras.org",
    list: [
      "Cockpit",
      "Docker",
      "KVM",
      "Plex",
      "Nextcloud",
      "Photoprism",
      "Syncthing",
      "WireGuard",
      "ZFS",
      "SnapRAID",
      "MergerFS",
    ],
  },

  // Configuration
  configuration: {
    file: "/etc/openmediavault/config.xml",
    backup: "Web GUI backup/restore",
    saltstack: "SaltStack for deployment",
  },

  // SaltStack integration
  saltstack: {
    enabled: true,
    states: "/srv/salt/omv/",
    deploy: "omv-salt deploy",
  },

  // ARM support
  arm: {
    raspberryPi: "Supported",
    odroid: "Supported",
    armbian: "Supported",
  },

  // Features
  features: {
    debianBased: true,
    webManaged: true,
    pluginExtensible: true,
    armSupport: true,
    monitoring: "RRDtool graphs",
    notifications: "Email alerts",
  },
};

export default openmediavaultConfig;