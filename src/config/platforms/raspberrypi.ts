// Raspberry Pi OS configuration (covers both 32-bit and 64-bit)
export const raspberryPiConfig = {
  // Detection methods
  detection: {
    osReleaseId: "debian", // Bookworm+ shows as debian
    legacyId: "raspbian",  // Bullseye and earlier
    rpiIssueFile: "/etc/rpi-issue",
    deviceTreeModel: "/proc/device-tree/model",
  },

  // Raspberry Pi specific repositories
  repositories: {
    main: "http://archive.raspberrypi.org/debian",
    legacy: "http://archive.raspbian.org/raspbian",
  },

  // Essential packages for Raspberry Pi
  essentialPackages: {
    common: [
      "raspberrypi-kernel",
      "raspberrypi-bootloader",
      "raspi-config",
      "rpi-eeprom",
      "libraspberrypi-bin",
      "libraspberrypi-dev",
      "raspberrypi-sys-mods",
    ],
    desktop: [
      "raspberrypi-ui-mods",
      "rp-prefapps",
      "rc-gui",
      "piwiz",
    ],
    lite: [
      "raspi-config",
      "rpi-eeprom",
    ],
  },

  // Hardware-specific configurations
  hardware: {
    // GPIO access
    gpio: {
      enable: true,
      packages: ["python3-gpiozero", "python3-rpi.gpio", "wiringpi"],
      permissions: "dialout", // Group for GPIO access
    },
    
    // Camera module
    camera: {
      enable: true,
      packages: ["raspicam", "libcamera-apps"],
      config: "/boot/config.txt",
    },
    
    // I2C, SPI, UART
    interfaces: {
      i2c: { enable: true, packages: ["i2c-tools"] },
      spi: { enable: true, packages: [] },
      uart: { enable: true, packages: [] },
      onewire: { enable: false, packages: [] },
    },
    
    // Audio
    audio: {
      packages: ["alsa-utils", "pulseaudio"],
      config: "/boot/config.txt",
    },
    
    // Video/Display
    display: {
      packages: ["raspberrypi-ui-mods"],
      config: {
        hdmiForceHotplug: true,
        hdmiGroup: 2,
        hdmiMode: 82, // 1920x1080 60Hz
        gpuMem: 128,  // GPU memory in MB
      },
    },
  },

  // 32-bit vs 64-bit specific settings
  archSpecific: {
    "32": {
      kernel: "kernel7l.img", // Pi 2/3/4 32-bit
      userland: "armhf",
      maxMemory: "3GB", // 32-bit limitation
      packages: ["raspberrypi-kernel", "libraspberrypi0"],
    },
    "64": {
      kernel: "kernel8.img", // Pi 3/4/5 64-bit
      userland: "arm64",
      maxMemory: "8GB+",
      packages: ["raspberrypi-kernel64", "libraspberrypi0"],
    },
  },

  // Performance optimizations
  optimizations: {
    overclock: {
      enable: false, // Disabled by default for safety
      armFreq: 2000, // MHz (Pi 4)
      gpuFreq: 750,
      overVoltage: 6,
    },
    
    zram: {
      enable: true,
      size: "512M",
      algorithm: "lz4",
    },
    
    swap: {
      enable: true,
      size: "100", // MB
    },
    
    gpuMemory: {
      headless: 16,
      desktop: 128,
      camera: 256,
    },
  },

  // Common use cases
  useCases: {
    desktop: {
      packages: [
        "raspberrypi-ui-mods",
        "chromium-browser",
        "vlc",
        "libreoffice",
        "gimp",
      ],
      config: {
        bootToDesktop: true,
        autoLogin: false,
      },
    },
    
    server: {
      packages: [
        "nginx",
        "postgresql",
        "docker.io",
        "docker-compose",
      ],
      config: {
        bootToCli: true,
      },
    },
    
    retroGaming: {
      packages: [
        "retroarch",
        "emulationstation",
        "mupen64plus",
      ],
      config: {
        gpuMem: 256,
        disableOverscan: true,
      },
    },
    
    iot: {
      packages: [
        "mosquitto",
        "node-red",
        "influxdb",
      ],
      config: {
        enableSerial: true,
        disableBluetooth: false,
      },
    },
  },

  // Security hardening
  security: {
    changeDefaultPassword: true,
    disableRootSsh: true,
    enableFirewall: true,
    fail2ban: true,
  },
};

export default raspberryPiConfig;