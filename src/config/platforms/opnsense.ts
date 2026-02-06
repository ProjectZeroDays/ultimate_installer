// OPNsense configuration - FreeBSD-based firewall
export const opnsenseConfig = {
  detection: {
    id: "opnsense",
    releaseFile: "/usr/local/opnsense/version/opnsense",
    opnsense: "/usr/local/opnsense",
    config: "/conf/config.xml",
  },

  // Fork of pfSense, based on FreeBSD/HardenedBSD
  base: "FreeBSD/HardenedBSD",
  fork: "Forked from pfSense",
  init: "FreeBSD init",
  hardened: true,

  // Package management
  packageManager: {
    name: "pkg",
    backend: "FreeBSD pkg",
    opnsense: "opnsense-update",
    install: "pkg install",
    remove: "pkg remove",
    update: "pkg update",
    upgrade: "opnsense-update",
  },

  // Firmware updates
  firmware: {
    tool: "opnsense-update",
    check: "opnsense-update -c",
    upgrade: "opnsense-update -u",
    major: "opnsense-update -ur",
  },

  // Configuration
  configuration: {
    file: "/conf/config.xml",
    backup: "/conf/backup/",
    history: "Configuration history",
    restore: "Web GUI or CLI",
  },

  // Web interface
  web: {
    url: "https://192.168.1.1",
    port: 443,
    user: "root",
    ssl: true,
    twoFactor: true,
  },

  // Features
  features: {
    firewall: "PF packet filter",
    nat: "Advanced NAT",
    vpn: ["IPsec", "OpenVPN", "WireGuard", "Tinc"],
    trafficShaper: "ALTQ/FAIRQ",
    captivePortal: true,
    idsIps: "Suricata",
    proxy: "Squid",
    webFilter: "Proxy with categories",
    ha: "CARP + pfsync",
    multiWan: "Load balancing/failover",
    ddns: "Dynamic DNS",
    dhcp: "ISC DHCP + Kea",
    dns: "Unbound + dnsmasq",
  },

  // Plugins
  plugins: {
    os: "os-* packages",
    list: "opnsense-plugins repository",
    development: "Easy plugin development",
  },

  // API
  api: {
    enabled: true,
    key: "API key + secret",
    documentation: "/api/core/resource/search/",
  },

  // Development
  development: {
    mvc: "Model-View-Controller framework",
    volt: "Volt templates",
    phalcon: "Phalcon PHP framework",
    plugins: "/usr/local/opnsense/scripts/",
  },

  // Differences from pfSense
  differences: {
    hardened: "HardenedBSD base",
    plugins: "Better plugin system",
    api: "REST API included",
    zfs: "ZFS by default",
    development: "Easier to contribute",
  },
};

export default opnsenseConfig;