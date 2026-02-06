// SerenityOS configuration
export const serenityosConfig = {
  detection: {
    id: "serenityos",
    uname: "SerenityOS",
    serenity: "/etc/serenity-release",
    bin: "/bin/serenity",
  },

  // From-scratch Unix-like OS
  base: "Independent",
  kernel: "Serenity Kernel",
  libc: "Serenity LibC",
  compiler: "Clang/LLVM",
  gui: "Serenity Desktop Environment",

  // No traditional package manager - ports system
  packageManager: {
    name: "Ports",
    type: "Source-based ports",
    directory: "/usr/Ports",
    build: "./package.sh",
    noBinaries: true,
  },

  // Ports collection
  ports: {
    location: "/usr/Ports",
    categories: [
      "Audio",
      "DeveloperTools",
      "Games",
      "Graphics",
      "Internet",
      "Miscellaneous",
      "Office",
      "System",
      "Video",
    ],
    count: "400+",
  },

  // Building software
  building: {
    crossCompile: "From Linux host",
    toolchain: "Clang/LLVM cross-compiler",
    buildIt: "Meta build system",
    ladybird: "Built-in web browser",
  },

  // Package format (if any)
  packages: {
    format: "None (compile from source)",
    future: "Maybe .spkg (Serenity Package)",
    manifest: "package.sh in Ports",
  },

  // Development
  development: {
    language: "C++ primarily",
    qt: "Qt5/Qt6 ports available",
    sdl: "SDL2 supported",
    nativeGui: "LibGUI/LibWeb",
    ide: "HackStudio (built-in)",
  },

  // Features
  features: {
    unixLike: true,
    posix: "Partial",
    proprietary: false,
    webBrowser: "Ladybird (built-in)",
    ide: "HackStudio",
    terminal: "Terminal app",
    browser: true,
    games: true,
    demos: true,
  },

  // Limitations
  limitations: {
    noPackageManager: "Must compile from source",
    noPrebuiltBinaries: "Build everything",
    hardwareSupport: "Limited (mostly VirtualBox/QEMU)",
    realHardware: "Experimental",
  },
};

export default serenityosConfig;