// macOS-specific configuration
export const macosConfig = {
  // Homebrew settings
  homebrew: {
    taps: [
      "homebrew/cask",
      "homebrew/cask-versions",
      "homebrew/cask-fonts",
      "homebrew/services",
    ],
    casks: [
      "visual-studio-code",
      "docker",
      "postman",
      "jetbrains-toolbox",
      "google-chrome",
      "firefox",
      "slack",
      "zoom",
      "1password",
      "protonvpn",
    ],
  },

  // Mac App Store apps (if mas is installed)
  masApps: {
    "Xcode": 497799835,
    "Microsoft Remote Desktop": 1295203466,
  },

  // Essential formulae
  essentialPackages: [
    "git", "curl", "wget", "vim", "nano",
    "python@3.11", "node", "go", "rust",
    "docker", "docker-compose",
    "nginx", "postgresql@15", "redis",
    "openssl", "openssh",
    "htop", "tmux", "zsh", "fish",
    "mas", // Mac App Store CLI
    "brew-cask-completion",
  ],

  // macOS-specific settings
  macOSSettings: {
    // Finder
    showHiddenFiles: true,
    showPathBar: true,
    showStatusBar: true,
    
    // Dock
    autoHide: true,
    minimizeToApplication: true,
    enableSuckEffect: false,
    
    // Security
    firewall: true,
    stealthMode: true,
    
    // Performance
    disableAnimations: false,
    increaseKeyRepeat: true,
  },

  // Security tools
  securityTools: [
    "nmap",
    "wireshark",
    "john-jumbo",
    "hashcat",
    "hydra",
    "sqlmap",
    "metasploit",
    "burp-suite",
  ],

  paths: {
    home: "${HOME}",
    applications: "/Applications",
    userApplications: "${HOME}/Applications",
  },
};

export default macosConfig;