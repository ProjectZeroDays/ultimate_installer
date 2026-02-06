// OpenWrt configuration - Embedded Linux for routers
export const openwrtConfig = {
  // Detection
  detection: {
    releaseFile: "/etc/openwrt_release",
    boardJson: "/etc/board.json",
    configPath: "/etc/config",
  },

  // UCI (Unified Configuration Interface)
  uci: {
    command: "uci",
    configDir: "/etc/config",
    show: "uci show",
    get: "uci get",
    set: "uci set",
    commit: "uci commit",
    changes: "uci changes",
  },

  // System configuration files
  config: {
    system: "/etc/config/system",
    network: "/etc/config/network",
    wireless: "/etc/config/wireless",
    firewall: "/etc/config/firewall",
    dhcp: "/etc/config/dhcp",
    dropbear: "/etc/config/dropbear",
    luci: "/etc/config/luci",
  },

  // Package management
  packages: {
    manager: "opkg",
    update: "opkg update",
    install: "opkg install",
    remove: "opkg remove",
    list: "opkg list-installed",
    listsDir: "/var/opkg-lists",
    overlay: "/overlay", // Writeable overlay
  },

  // Essential packages for routers
  essentialPackages: [
    "base-files",
    "busybox",
    "dnsmasq",
    "dropbear",
    "firewall4",
    "fstools",
    "kernel",
    "kmod-nft-offload",
    "libc",
    "libgcc",
    "libustream-wolfssl",
    "logd",
    "mtd",
    "netifd",
    "nftables",
    "odhcp6c",
    "odhcpd-ipv6only",
    "opkg",
    "ppp",
    "ppp-mod-pppoe",
    "procd",
    "procd-seccomp",
    "procd-ujail",
    "uci",
    "uclient-fetch",
    "urandom-seed",
    "urngd",
  ],

  // Web interface
  luci: {
    enabled: true,
    packages: ["luci", "luci-ssl", "luci-app-firewall"],
    url: "http://192.168.1.1",
  },

  // Network
  network: {
    wan: "eth0",
    lan: "br-lan",
    wifi: "wlan0",
    protocols: ["static", "dhcp", "pppoe", "3g", "4g", "qmi", "mbim", "ncm"],
  },

  // Wireless
  wireless: {
    drivers: ["mac80211", "mt76", "ath10k", "ath11k", "broadcom"],
    encryption: ["none", "wep", "psk", "psk2", "sae", "wpa3"],
    modes: ["ap", "sta", "adhoc", "monitor", "mesh"],
  },

  // Firewall
  firewall: {
    backend: "nftables", // Firewall4
    zones: ["lan", "wan"],
    rules: "/etc/config/firewall",
    includes: "/etc/nftables.d",
  },

  // Storage
  storage: {
    overlay: "/overlay",
    tmp: "/tmp",
    external: "/mnt/sda1",
    extroot: true,
  },

  // Hardware
  hardware: {
    detect: "cat /tmp/sysinfo/board_name",
    model: "cat /tmp/sysinfo/model",
    temp: "cat /sys/class/thermal/thermal_zone0/temp",
  },

  // Services
  services: {
    dns: ["dnsmasq", "unbound", "stubby"],
    vpn: ["openvpn", "wireguard", "strongswan", "zerotier"],
    dlna: ["minidlna", "ffmpeg"],
    fileSharing: ["samba4", "nfs-kernel-server", "ksmbd"],
    monitoring: ["collectd", "vnstat", "nlbwmon"],
  },
};

export default openwrtConfig;