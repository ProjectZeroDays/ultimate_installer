// ReactOS configuration - Open source Windows NT clone
export const reactosConfig = {
  detection: {
    id: "reactos",
    releaseFile: "/etc/reactos-version",
    uname: "ReactOS",
    systemRoot: "C:\\ReactOS",
  },

  // Windows NT compatible
  base: "Windows NT architecture",
  kernel: "ReactOS NT Kernel",
  win32: "Win32 API compatible",
  binaryCompatible: "Windows XP/2003 Server",

  // Package manager
  packageManager: {
    name: "RAPPS",
    fullName: "ReactOS Application Manager",
    gui: true,
    cli: false,
    database: "rapps-db",
  },

  // RAPPS (ReactOS Apps)
  rapps: {
    url: "https://github.com/reactos/rapps-db",
    format: ".txt metadata files",
    install: "Download and run installer",
    categories: [
      "Audio",
      "Video",
      "Graphics",
      "Games",
      "Internet",
      "Office",
      "Development",
      "System",
      "Utilities",
    ],
  },

  // Software installation
  software: {
    exe: "Windows executables",
    msi: "MSI installers",
    zip: "ZIP archives",
    noPackageFormat: "No native package format",
  },

  // Build system
  build: {
    compiler: "MSVC or MinGW",
    cmake: "CMake build system",
    ninja: "Ninja generator",
    rosbe: "ReactOS Build Environment",
  },

  // Compatibility
  compatibility: {
    win32api: "Partial",
    drivers: "Partial (needs testing)",
    directx: "Limited",
    dotnet: "Not working",
    wow64: "Not implemented (x64 limitation)",
  },

  // Status
  status: {
    version: "0.4.x",
    maturity: "Alpha",
    usable: "Basic functionality, not daily driver",
    hardware: "Limited driver support",
  },

  // Features
  features: {
    openSource: true,
    windowsCompatible: true,
    ntKernel: true,
    explorerShell: true,
    registry: true,
    services: true,
  },
};

export default reactosConfig;