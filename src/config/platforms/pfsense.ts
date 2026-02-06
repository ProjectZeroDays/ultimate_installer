// pfSense and OPNsense configuration - FreeBSD-based firewalls
export const pfsenseConfig = {
  // Detection
  detection: {
    pfsense: "/etc/pfSense",
    opnsense: "/usr/local/opnsense",
    version: "/etc/version",
    platform: "/etc/platform",
  },

  // Package management
  packages: {
    manager: "pkg",
    pfSense: "pkg install pfSense-pkg-*",
    opnsense: "pkg install os-*",
    repos: "/usr/local/etc/pkg/repos",
  },

  // pfSense-specific
  pfsense: {
    config: "/cf/conf/config.xml",
    backup: "/cf/conf/backup",
    rrd: "/var/db/rrd",
    logs: "/var/log",
    webgui: "https://192.168.1.1",
  },

  // OPNsense-specific
  opnsense: {
    config: "/conf/config.xml",
    backup: "/conf/backup",
    logs: "/var/log",
    webgui: "https://192.168.1.1",
    firmware: "opnsense-update",
  },

  // Firewall
  firewall: {
    backend: "pf", // Packet Filter
    rules: "/etc/pf.conf",
    anchors: "/etc/pf.anchors",
    tables: "pfctl -t",
    nat: "nat",
    aliases: "aliases",
  },

  // Network
  network: {
    interfaces: ["wan", "lan", "opt1", "opt2"],
    vlans: true,
    lagg: true,
    bridges: true,
    gre: true,
    gif: true,
    ipsec: true,
    openvpn: true,
    wireguard: true,
  },

  // Services
  services: {
    dhcp: "dhcpd",
    dns: ["unbound", "dnsmasq", "bind"],
    ntp: "ntpd",
    snmp: "bsnmpd",
    proxy: "squid",
    captivePortal: "captiveportal",
    trafficShaper: "shaper",
  },

  // High availability
  ha: {
    carp: "Common Address Redundancy Protocol",
    pfsync: "pf state synchronization",
    xmlrpc: "Configuration synchronization",
  },

  // VPN
  vpn: {
    ipsec: "strongswan",
    openvpn: "openvpn",
    wireguard: "wireguard-go",
    l2tp: "mpd5",
    pptp: "mpd5",
  },

  // Monitoring
  monitoring: {
    rrd: "RRDtool",
    ntopng: "ntopng",
    zabbix: "zabbix-agent",
    telegraf: "telegraf",
  },

  // Development
  development: {
    shell: "pfSense-php-shell",
    devEnv: "pfsense-tools",
  },
};

export default pfsenseConfig;