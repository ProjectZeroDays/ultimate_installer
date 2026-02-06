// Termux-specific configurations and tweaks
export const termuxConfig = {
  // Repository mirrors for faster downloads
  mirrors: [
    "https://packages.termux.dev/apt/termux-main",
    "https://mirrors.tuna.tsinghua.edu.cn/termux/apt/termux-main",
    "https://mirrors.aliyun.com/termux/termux-main",
  ],

  // Essential proot distributions
  prootDistros: ["debian", "alpine", "archlinux", "fedora", "ubuntu"],

  // Storage optimization for mobile
  storageOptimization: {
    enableZram: true,
    zramSize: "1G",
    swapFile: true,
    swapSize: "2G",
  },

  // Battery optimization
  batteryOptimization: {
    disableWakeLock: false,
    enableDoze: true,
    backgroundLimit: "adaptive",
  },

  // Security hardening for rooted devices
  securityHardening: {
    enableSELinux: true,
    disableAdbOverNetwork: true,
    enableAppArmor: false, // Not available on Android
  },

  // Useful aliases for Termux
  aliases: {
    "update-all": "pkg update && pkg upgrade",
    "install": "pkg install",
    "search": "pkg search",
    "clean": "pkg autoclean",
    "storage": "termux-setup-storage",
    "api": "termux-api",
  },

  // Shortcuts for proot
  prootShortcuts: {
    "debian": "proot-distro login debian",
    "alpine": "proot-distro login alpine",
    "arch": "proot-distro login archlinux",
  },
};

// iSH-specific configurations
export const ishConfig = {
  // iSH uses Alpine repositories but with i386 architecture
  repositories: [
    "https://dl-cdn.alpinelinux.org/alpine/edge/main",
    "https://dl-cdn.alpinelinux.org/alpine/edge/community",
    "https://dl-cdn.alpinelinux.org/alpine/edge/testing",
  ],

  // iSH-specific optimizations (x86 emulation on ARM)
  optimizations: {
    enableJit: false, // Not available on iOS
    reduceMemoryUsage: true,
    disableUnnecessaryServices: true,
  },

  // iOS file system integration
  iosIntegration: {
    documentsPath: "/mnt/ios",
    icloudPath: "/mnt/icloud",
    shortcutsPath: "/mnt/shortcuts",
  },

  // Background execution settings
  backgroundExecution: {
    enableLocationUpdates: false,
    enableBackgroundFetch: true,
    keepAliveInterval: 600, // seconds
  },
};
