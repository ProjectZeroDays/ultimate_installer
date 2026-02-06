// Tails configuration - Privacy-focused live OS
export const tailsConfig = {
  // Detection
  detection: {
    amnesia: "/etc/amnesia",
    tails: "/etc/tails",
    version: "/etc/amnesia/version",
    liveConfig: "/live/config",
  },

  // Amnesic properties
  amnesia: {
    noPersistentStorage: true,
    encryptedPersistence: true,
    memoryWipe: true,
    noSwap: true,
  },

  // Persistence
  persistence: {
    enabled: false, // User must enable
    partition: "TailsData",
    luks: true,
    features: [
      "Personal Data",
      "GnuPG",
      "SSH Client",
      "Pidgin",
      "Thunderbird",
      "GNOME Keyring",
      "Network Connections",
      "Browser Bookmarks",
      "Printers",
      "Bitcoin Client",
      "APT Packages",
      "APT Lists",
      "Dotfiles",
    ],
  },

  // Security
  security: {
    tor: true,
    macSpoofing: true,
    unsafeBrowser: false,
    appArmor: true,
    firejail: true,
    kernelHardening: true,
  },

  // Tor
  tor: {
    enabled: true,
    bridges: false,
    obfs4: false,
    snowflake: false,
    meek: false,
    controlPort: 9051,
    socksPort: 9050,
  },

  // Networking
  network: {
    macSpoofing: true,
    offlineMode: false,
    torOnly: true,
    captivePortal: "unsafe-browser",
  },

  // Applications
  applications: {
    browser: "Tor Browser",
    email: "Thunderbird with TorBirdy",
    chat: "Pidgin with OTR",
    office: "LibreOffice",
    gpg: "GnuPG with Seahorse",
    keepass: "KeePassXC",
    onionshare: "OnionShare",
    metadata: "MAT (Metadata Anonymisation Toolkit)",
  },

  // Persistence setup
  persistenceSetup: {
    wizard: "tails-persistence-setup",
    unlock: "cryptsetup luksOpen",
    mount: "/live/persistence/TailsData_unlocked",
  },

  // Shutdown
  shutdown: {
    memoryWipe: true,
    emergency: "emergency shutdown",
  },

  // Development
  development: {
    build: "live-build",
    config: "auto/config",
    customize: "hooks",
  },
};

export default tailsConfig;