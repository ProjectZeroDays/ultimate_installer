// ChromeOS Linux (Crostini) configuration
export const chromeosConfig = {
  // ChromeOS detection
  detection: {
    crosMilestone: "/dev/.cros_milestone",
    crosRelease: "/etc/cros-release",
    lsbRelease: "/etc/lsb-release",
    chromeosLsb: "CHROMEOS_RELEASE_NAME",
  },

  // Crostini (Linux on ChromeOS) settings
  crostini: {
    containerName: "penguin",
    vmName: "termina",
    defaultUser: "user",
    homeDirectory: "/home/user",
    sharedFolders: ["/mnt/chromeos/MyFiles", "/mnt/chromeos/GoogleDrive"],
  },

  // ChromeOS-specific limitations and features
  limitations: {
    noSystemdNspawn: true,
    noKernelModules: true,
    noRawSockets: true,
    limitedDeviceAccess: true,
    noUsbAccess: true, // Limited USB passthrough
    noAudioCapture: false, // Audio capture works
    gpuAcceleration: true, // VirGL or GPU passthrough
  },

  // Recommended packages for ChromeOS
  essentialPackages: [
    "chrome-gnome-shell",
    "xdg-utils",
    "xdg-user-dirs",
    "fonts-noto",
    "fonts-noto-cjk",
    "fonts-noto-color-emoji",
    "libgl1-mesa-glx",
    "libgl1-mesa-dri",
  ],

  // GUI applications that work well on ChromeOS
  guiApps: {
    code: "code --enable-proposed-api", // VS Code with extensions
    androidStudio: "studio.sh",
    flutter: "flutter",
    gimp: "gimp",
    inkscape: "inkscape",
    libreoffice: "libreoffice",
    firefox: "firefox",
    chrome: "google-chrome-stable",
  },

  // Integration with ChromeOS
  integration: {
    waylandSupport: true,
    sommelier: true, // X11/Wayland bridge
    garcon: true,    // File sharing
    cicerone: true,  // Container management
    seneschal: true, // VM management
  },

  // Development tools popular on ChromeOS
  devTools: [
    "git",
    "nodejs",
    "npm",
    "python3",
    "python3-pip",
    "golang",
    "rust",
    "cargo",
    "flutter",
    "dart",
    "android-sdk",
    "adb",
    "fastboot",
  ],

  paths: {
    crostiniRoot: "/mnt/chromeos",
    downloads: "/mnt/chromeos/MyFiles/Downloads",
    drive: "/mnt/chromeos/GoogleDrive",
    shared: "/mnt/chromeos/MyFiles",
    linuxFiles: "/mnt/chromeos/MyFiles/LinuxFiles",
  },
};

export default chromeosConfig;