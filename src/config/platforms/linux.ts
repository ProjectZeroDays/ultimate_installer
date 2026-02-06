// Generic Linux configuration
export const linuxConfig = {
  detection: {
    id: "linux",
    uname: "Linux",
    proc: "/proc",
    sys: "/sys",
  },

  // Generic Linux detection
  base: "Linux kernel",
  generic: true,
  fallback: true,

  // Detection methods
  detectionMethods: {
    osRelease: "/etc/os-release",
    lsbRelease: "/etc/lsb-release",
    issue: "/etc/issue",
    procVersion: "/proc/version",
    uname: "uname -a",
  },

  // Common package managers (detect which is available)
  packageManagers: {
    apt: {
      check: "which apt",
      debian: true,
      ubuntu: true,
    },
    dnf: {
      check: "which dnf",
      fedora: true,
      rhel: true,
    },
    yum: {
      check: "which yum",
      centos: true,
      older: true,
    },
    pacman: {
      check: "which pacman",
      arch: true,
    },
    zypper: {
      check: "which zypper",
      suse: true,
    },
    apk: {
      check: "which apk",
      alpine: true,
    },
    xbps: {
      check: "which xbps-install",
      void: true,
    },
    portage: {
      check: "which emerge",
      gentoo: true,
    },
    nix: {
      check: "which nix",
      nixos: true,
    },
    guix: {
      check: "which guix",
      guix: true,
    },
    slackpkg: {
      check: "which slackpkg",
      slackware: true,
    },
    opkg: {
      check: "which opkg",
      openwrt: true,
      embedded: true,
    },
  },

  // Common paths
  paths: {
    bin: "/bin,/usr/bin,/usr/local/bin",
    sbin: "/sbin,/usr/sbin,/usr/local/sbin",
    lib: "/lib,/usr/lib,/usr/local/lib",
    etc: "/etc",
    var: "/var",
    opt: "/opt",
    home: "/home",
    root: "/root",
    tmp: "/tmp,/var/tmp",
    proc: "/proc",
    sys: "/sys",
    dev: "/dev",
    run: "/run",
  },

  // Common commands
  commands: {
    ls: "ls",
    cat: "cat",
    grep: "grep",
    awk: "awk",
    sed: "sed",
    cut: "cut",
    sort: "sort",
    uniq: "uniq",
    wc: "wc",
    head: "head",
    tail: "tail",
    find: "find",
    xargs: "xargs",
    tar: "tar",
    gzip: "gzip",
    gunzip: "gunzip",
    zip: "zip",
    unzip: "unzip",
    curl: "curl",
    wget: "wget",
    ssh: "ssh",
    scp: "scp",
    rsync: "rsync",
    git: "git",
    make: "make",
    gcc: "gcc",
    python: "python3,python",
    perl: "perl",
    ruby: "ruby",
    node: "node,nodejs",
  },

  // Features
  features: {
    unix: true,
    posix: true,
    multiuser: true,
    multitasking: true,
    filesystems: ["ext4", "xfs", "btrfs", "zfs", "nfs", "cifs"],
    networking: true,
    containers: ["docker", "podman", "lxc", "systemd-nspawn"],
  },
};

export default linuxConfig;