// MINIX 3 configuration - Microkernel OS
export const minixConfig = {
  detection: {
    id: "minix",
    uname: "Minix",
    releaseFile: "/etc/minix-version",
    version: "/etc/motd",
  },

  // Microkernel research OS
  base: "MINIX 3",
  type: "Microkernel",
  userland: "NetBSD-derived",
  purpose: "Education, embedded, high reliability",

  // Package management - pkgsrc from NetBSD
  packageManager: {
    name: "pkgin",
    netbsd: "From NetBSD",
    install: "pkgin install",
    remove: "pkgin remove",
    update: "pkgin update",
    upgrade: "pkgin upgrade",
    search: "pkgin search",
  },

  // pkgsrc
  pkgsrc: {
    location: "/usr/pkgsrc",
    bootstrap: "cd /usr && make pkgsrc-create",
    build: "make install",
  },

  // Microkernel architecture
  architecture: {
    microkernel: "True microkernel",
    drivers: "User-space drivers",
    reincarnation: "Driver restart on failure",
    reliability: "Self-healing design",
  },

  // Components
  components: {
    kernel: "Microkernel (~6,000 lines)",
    drivers: "User-space processes",
    servers: "File system, process manager, etc.",
    init: "Reincarnation server",
  },

  // POSIX
  posix: {
    compatible: true,
    netbsd: "NetBSD userland",
    unix: "Unix-like",
  },

  // Use cases
  useCases: {
    education: "OS courses (Tanenbaum's book)",
    embedded: "High reliability embedded",
    research: "Microkernel research",
  },

  // Limitations
  limitations: {
    desktop: "Not for desktop use",
    performance: "Microkernel overhead",
    hardware: "Limited driver support",
    development: "Research project status",
  },

  // History
  history: {
    v1: "1987 - Educational",
    v2: "1997 - Educational",
    v3: "2005 - Serious/production use",
    status: "