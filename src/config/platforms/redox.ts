// Redox OS configuration - Rust-based microkernel OS
export const redoxConfig = {
  detection: {
    id: "redox",
    uname: "Redox",
    redox: "/etc/redox-release",
    scheme: ":", // Uses URL-like schemes
  },

  // Rust-based operating system
  base: "Independent",
  kernel: "Redox microkernel",
  language: "Rust",
  libc: "relibc (Rust libc)",
  userspace: "Rust + some C ported",

  // Package manager
  packageManager: {
    name: "pkgutils",
    command: "pkg",
    install: "pkg install",
    remove: "pkg remove",
    update: "pkg update",
    upgrade: "pkg upgrade",
    search: "pkg search",
    list: "pkg list",
  },

  // Build system
  build: {
    tool: "cargo",
    cookbook: "cookbook recipes",
    recipes: "/cookbook/recipes",
    make: "make",
    configure: "configure",
  },

  // Cookbook recipes
  cookbook: {
    format: "recipe.toml",
    repository: "https://gitlab.redox-os.org/redox-os/cookbook",
    build: "cargo build --target x86_64-unknown-redox",
  },

  // Filesystem
  filesystem: {
    default: "RedoxFS",
    schemes: true, // URL-like filesystem access
    examples: ["file:", "network:", "display:"],
  },

  // Software
  software: {
    ported: "Partial POSIX software via ports",
    native: "Rust-native applications",
    gui: "Orbital (windowing system)",
    terminal: "Terminal emulator",
    browser: "None yet (porting Servo)",
  },

  // Features
  features: {
    microkernel: true,
    rust: true,
    memorySafe: true,
    unixLike: true,
    posix: "Partial",
    selfHosting: false, // Still in development
  },

  // Status
  status: {
    maturity: "Alpha/Experimental",
    usable: "Basic functionality",
    hardware: "Limited hardware support",
    vm: "Best in QEMU/VirtualBox",
  },
};

export default redoxConfig;