// Linux Kodachi configuration - Privacy-focused OS
export const kodachiConfig = {
  detection: {
    id: "kodachi",
    releaseFile: "/etc/kodachi-version",
    kodachi: "/etc/kodachi",
    osRelease: "ID=kodachi",
  },

  // Based on Debian
  base: "Debian",
  focus: "Privacy, anonymity, security",
  type: "Live OS / Installable",

  // Package management
  packageManager: {
    name: "apt",
    install: "apt install",
    remove: "apt remove",
    update: "apt update",
    upgrade: "apt upgrade",
  },

  // Privacy features
  privacy: {
    tor: "All traffic through Tor",
    vpn: "Built-in VPN support",
    dns: "DNS encryption",
    mac: "MAC address spoofing",
    noLogs: "No logs kept",
    ramOnly: "Runs from RAM",
    encrypted: "Encrypted persistence optional",
  },

  // Kodachi Dashboard
  dashboard: {
    name: "Kodachi Dashboard",
    features: [
      "Tor status",
      "VPN status",
      "IP address",
      "DNS status",
      "System monitor",
      "Security status",
    ],
  },

  // Network
  network: {
    tor: "Transparent Tor proxy",
    i2p: "I2P support",
    vpn: "VPN client included",
    dnscrypt: "DNSCrypt by default",
    macchanger: "MAC spoofing",
  },

  // Security tools
  security: {
    apparmor: "Enabled",
    firejail: "Sandboxing",
    firewall: "iptables/nftables",
    antivirus: "ClamAV",
    rootkit: "rkhunter, chkrootkit",
  },

  // Applications
  applications: {
    browser: "Tor Browser (modified)",
    email: "Thunderbird with Tor",
    chat: "HexChat, Pidgin",
    vpn: "OpenVPN, WireGuard",
    office: "LibreOffice",
    media: "VLC (modified)",
  },

  // Features
  features: {
    amnesic: "No traces left",
    torTransparent: "All traffic through Tor",
    vpnKillSwitch: "Kill switch enabled",
    dnsLeakProtection: "DNS leak protection",
    macSpoofing: "Automatic MAC spoofing",
    encryptedPersistence: "Optional",
    xfce: "Xfce desktop",
  },

  // Comparison
  comparison: {
    tails: "Similar to Tails but with VPN option",
    kodachi: "More user-friendly than Tails",
    both: "Both privacy-focused",
  },
};

export default kodachiConfig;