// Native Android configuration (not Termux)
export const androidConfig = {
  detection: {
    id: "android",
    buildProp: "/system/build.prop",
    settings: "settings",
    getprop: "getprop",
    uname: "Linux (Android kernel)",
  },

  // Mobile operating system
  base: "Linux kernel",
  type: "Mobile OS",
  userland: "Bionic libc, Android runtime",
  java: "Android Runtime (ART)",

  // Package management
  packageManager: {
    name: "pm",
    fullName: "Package Manager (CLI)",
    install: "pm install",
    uninstall: "pm uninstall",
    list: "pm list packages",
    path: "pm path",
    clear: "pm clear",
    enable: "pm enable",
    disable: "pm disable",
  },

  // Google Play Store
  playStore: {
    name: "Google Play Store",
    install: "Market://details?id=",
    services: "Google Play Services",
    framework: "Google Services Framework",
  },

  // Alternative stores
  alternatives: {
    fdroid: "F-Droid (open source)",
    aurora: "Aurora Store (Play Store client)",
    amazon: "Amazon Appstore",
    samsung: "Galaxy Store",
    huawei: "Huawei AppGallery",
    apkPure: "APKPure",
    aptoide: "Aptoide",
  },

  // Sideloading
  sideloading: {
    apks: "APK files",
    unknownSources: "Enable in settings",
    adb: "adb install",
    ota: "Over-the-air updates",
  },

  // ADB (Android Debug Bridge)
  adb: {
    install: "adb install",
    uninstall: "adb uninstall",
    shell: "adb shell",
    push: "adb push",
    pull: "adb pull",
    logcat: "adb logcat",
    reboot: "adb reboot",
  },

  // Root/Custom ROM
  root: {
    magisk: "Magisk (systemless root)",
    supersu: "SuperSU (legacy)",
    busybox: "BusyBox",
    xposed: "Xposed Framework",
    lsposed: "LSPosed (modern)",
  },

  // Custom ROMs
  customRoms: {
    lineageos: "LineageOS",
    grapheneos: "GrapheneOS (privacy)",
    calyxos: "CalyxOS (privacy)",
    divestos: "DivestOS (privacy)",
    resurrection: "Resurrection Remix",
    paranoid: "Paranoid Android",
    crdroid: "crDroid",
    pixelExperience: "Pixel Experience",
  },

  // Development
  development: {
    sdk: "Android SDK",
    studio: "Android Studio",
    ndk: "Native Development Kit",
    emulator: "Android Emulator",
    fastboot: "fastboot",
    logcat: "logcat",
    dumpsys: "dumpsys",
  },

  // Features
  features: {
    sandbox: "App sandbox",
    permissions: "Runtime permissions",
    intents: "Intent system",
    services: "Background services",
    notifications: "Notification system",
    widgets: "Home screen widgets",
    multiUser: "Multi-user support",
    workProfile: "Work profile",
    seamlessUpdates: "A/B seamless updates",
  },

  // Versions
  versions: {
    cupcake: "1.5",
    donut: "1.6",
    eclair: "2.0-2.1",
    froyo: "2.2",
    gingerbread: "2.3",
    honeycomb: "3.0",
    iceCreamSandwich: "4.0",
    jellyBean: "4.1-4.3",
    kitKat: "4.4",
    lollipop: "5.0-5.1",
    marshmallow: "6.0",
    nougat: "7.0-7.1",
    oreo: "8.0-8.1",
    pie: "9",
    ten: "10",
    eleven: "11",
    twelve: "12",
    thirteen: "13",
    fourteen: "14",
    fifteen: "15",
  },
};

export default androidConfig;