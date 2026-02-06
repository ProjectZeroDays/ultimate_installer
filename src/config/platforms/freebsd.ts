// FreeBSD configuration
export const freebsdConfig = {
  detection: {
    id: "freebsd",
    uname: "FreeBSD",
    releaseFile: "/etc/freebsd-version",
    version: "freebsd-version",
  },

  // BSD UNIX
  base: "BSD 4.4",
  type: "Complete operating system",
  kernel: "FreeBSD kernel",
  userland: "FreeBSD",

  // Package management
  packageManager: {
    name: "pkg",
    fullName: "pkg (pkgng)",
    install: "pkg install",
    delete: "pkg delete",
    update: "pkg update",
    upgrade: "pkg upgrade",
    search: "pkg search",
    info: "pkg info",
    audit: "pkg audit",
    clean: "pkg clean",
    autoremove: "pkg autoremove",
  },

  // Ports collection
  ports: {