// Ubuntu Touch (UBports) configuration
export const ubuntutouchConfig = {
  detection: {
    id: "ubuntutouch",
    releaseFile: "/etc/lsb-release",
    ubports: "/etc/ubports-release",
    unity8: "/usr/bin/unity8", // Or Lomiri
    libertine: "/usr/bin/libertine-container-manager",
  },

  // Based on Ubuntu 16.04/20.04 with UBports patches
  base: "Ubuntu",
  version: "16.04 (xenial) or 20.04 (focal)",
  desktop: "Lomiri (formerly Unity 8)",

  // Package management (read-only root, libertine containers)
  packageManager: {
    system: "dpkg/apt (read-only)",
    click: "click package manager",
    libertine: "lxc container with apt",
  },

  // Click packages (sandboxed apps)
  click: {
    format: ".click",
    store: "OpenStore",
    install: "pkcon install-local",
    list: "click list",
    remove: "click unregister",
  },

  // Libertine (legacy X11 apps in container)
  libertine: {
    enabled: true,
    containers: "~/.cache/libertine-container/",
    manage: "libertine-container-manager",
    install: "libertine-container-manager exec --container-id CONTAINER -- apt install",
  },

  // System updates
  updates: {
    imageBased: true,
    channels: ["stable", "rc", "devel"],
    tool: "system-settings update",
    ubportsInstaller: "https://github.com/ubports/ubports-installer",
  },

  // Development
  development: {
    sdk: "Ubuntu Touch SDK",
    clickable: "clickable", // Build tool
    qml: "Qt/QML apps preferred",
    cordova: "Apache Cordova supported",
  },

  // Hardware support
  devices: {
    oneplus: ["OnePlus One", "OnePlus 3/3T"],
    fairphone: ["Fairphone 2", "Fairphone 3/3+"],
    xiaomi: ["Redmi Note 7/7 Pro", "Mi A2/6X"],
    sony: ["Xperia X", "Xperia X Compact"],
    google: ["Nexus 5", "Nexus 5X", "Pixel 3a"],
    volla: ["Volla Phone", "Volla Phone X"],
  },

  // Features
  features: {
    convergence: true, // Desktop mode
    anbox: false, // Android compatibility removed
    waydroid: true, // New Android compatibility
    libertineX11: true,
    libertineWayland: false,
  },
};

export default ubuntutouchConfig;