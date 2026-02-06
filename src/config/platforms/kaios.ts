// KaiOS configuration - Firefox OS fork for feature phones
export const kaiosConfig = {
  // Detection
  detection: {
    userAgent: "KAIOS",
    platform: "Linux armv7l",
    geckoVersion: "48.0",
  },

  // Platform info
  platform: {
    type: "mobile",
    category: "feature phone",
    touchscreen: true,
    smartFeaturePhone: true,
  },

  // Technical specs
  technical: {
    kernel: "Linux 4.4",
    gecko: "48.0",
    b2g: "2.6", // Boot to Gecko
    gonk: "AOSP 5.1", // Low-level Android layer
  },

  // Application platform
  apps: {
    type: "web",
    runtime: "Gecko",
    manifest: "manifest.webapp",
    privileged: false, // Most apps are unprivileged
    packaged: true,
  },

  // APIs available
  apis: [
    "mozApps",
    "mozContacts",
    "mozMobileConnections",
    "mozMobileMessage",
    "mozNotification",
    "mozSettings",
    "mozPower",
    "mozAlarms",
    "mozBluetooth",
    "mozWifiManager",
    "mozCameras",
    "mozFM",
  ],

  // Development
  development: {
    simulator: "KaiOS Simulator",
    debugger: "WebIDE",
    adb: "adb forward tcp:6000 localfilesystem:/data/local/debugger-socket",
  },

  // Store
  store: {
    name: "KaiStore",
    url: "https://www.kaiostech.com/store",
    sideloading: false, // Generally restricted
  },

  // Limitations
  limitations: {
    noNativeCode: true,
    noBackgroundServices: true,
    limitedStorage: true,
    noPlayServices: true,
  },
};

export default kaiosConfig;