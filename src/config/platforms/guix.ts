// GNU Guix System configuration
export const guixConfig = {
  // Guix detection
  detection: {
    guixSystem: "/etc/guix-system",
    guixVersion: "/run/current-system/guix-version",
    operatingSystem: "/etc/configuration.scm",
  },

  // Guix package manager
  guix: {
    packageManager: "guix",
    systemManager: "guix system",
    userManager: "guix package",
    pull: "guix pull",
    channels: "~/.config/guix/channels.scm",
    store: "/gnu/store",
    profiles: "~/.guix-profile",
  },

  // System configuration
  system: {
    configFile: "/etc/configuration.scm",
    reconfigure: "sudo guix system reconfigure /etc/configuration.scm",
    generations: "guix system list-generations",
    rollBack: "sudo guix system roll-back",
  },

  // Channels (repositories)
  channels: {
    guix: "https://git.savannah.gnu.org/git/guix.git",
    nonguix: "https://gitlab.com/nonguix/nonguix", // Non-free software
    flat: "https://github.com/flatwhatson/guix-channel", // Flat packages
  },

  // Essential packages
  essentialPackages: [
    "emacs",
    "vim",
    "git",
    "htop",
    "tmux",
    "nss-certs", // SSL certificates
  ],

  // Services
  services: {
    ssh: "(service openssh-service-type)",
    mcron: "(service mcron-service-type)",
    cups: "(service cups-service-type)",
    docker: "(service docker-service-type)",
    libvirt: "(service libvirt-service-type)",
    mysql: "(service mysql-service-type)",
    postgresql: "(service postgresql-service-type)",
  },

  // Filesystems
  filesystems: {
    btrfs: "btrfs",
    ext4: "ext4",
    xfs: "xfs",
    nfs: "nfs",
  },

  // Features
  features: {
    reproducible: true,
    transactional: true,
    declarative: true,
    unprivileged: true, // Per-user package management
  },

  // Substitutes (binary servers)
  substitutes: {
    ciGuix: "https://ci.guix.gnu.org",
    bordeaux: "https://bordeaux.guix.gnu.org",
  },
};

export default guixConfig;