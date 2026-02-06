// postmarketOS configuration - Alpine-based mobile Linux
export const postmarketosConfig = {
  // Detection
  detection: {
    id: "postmarketos",
    releaseFile: "/etc/postmarketos-release",
    pmaports: "/etc/apk/repositories.d/pmaports.list",
  },

  // Mobile-specific settings
  mobile: {
    interface: "phosh", // Default UI (phosh, plasma-mobile, sxmo)
    onScreenKeyboard: "squeekboard",
    displayManager: "tinydm",
  },

  // Device-specific configuration
  device: {
    info: "/etc/deviceinfo",
    name: "", // Detected at runtime
    codename: "", // e.g., "oneplus-enchilada"
    arch: "", // aarch64, armv7, x86_64
  },

  // Kernel
  kernel: {
    downstream: false, // Use mainline by default
    modules: "/lib/modules",
    cmdline: "/proc/cmdline",
  },

  // Essential mobile packages
  essentialPackages: [
    "postmarketos-base",
    "postmarketos-mkinitfs",
    "devicepkg-dev",
    "mobile-broadband-provider-info",
    "ofono",
    "ofonoctl",
    "iio-sensor-proxy",
    "upower",
    "dbus",
    "elogind",
    "polkit-elogind",
  ],

  // UI options
  uiOptions: {
    phosh: {
      packages: ["phosh", "phoc", "squeekboard", "gnome-keyring"],
      display: "wayland",
    },
    plasmaMobile: {
      packages: ["plasma-mobile", "plasma-phone-components", "maliit-keyboard"],
      display: "wayland",
    },
    sxmo: {
      packages: ["sxmo-utils", "sxmo-ui-sway", "foot"],
      display: "wayland",
    },
    weston: {
      packages: ["weston", "weston-shell-desktop"],
      display: "wayland",
    },
  },

  // Hardware support
  hardware: {
    modem: ["ofono", "modemmanager"],
    wifi: ["wpa_supplicant", "iwd"],
    bluetooth: ["bluez"],
    sensors: ["iio-sensor-proxy", "sensorfw"],
    gps: ["geoclue"],
    audio: ["alsa-utils", "pulseaudio", "pipewire"],
  },

  // Flashing/installation
  flashing: {
    tools: ["pmbootstrap", "fastboot", "heimdall", "android-tools"],
    methods: ["fastboot", "recovery", "heimdall", "mtkclient"],
  },

  // Development
  development: {
    chroot: "pmbootstrap chroot",
    build: "pmbootstrap build",
    install: "pmbootstrap install",
    flash: "pmbootstrap flasher",
  },
};

export default postmarketosConfig;