// Red Hat family (Fedora, CentOS, RHEL, Rocky, Alma)
export const redhatConfig = {
  repositories: {
    fedora: {
      official: "https://download.fedoraproject.org/pub/fedora/linux/releases/$releasever/Everything/$basearch/os/",
      updates: "https://download.fedoraproject.org/pub/fedora/linux/updates/$releasever/Everything/$basearch/",
    },
    epel: "https://dl.fedoraproject.org/pub/epel/epel-release-latest-$releasever.noarch.rpm",
  },

  essentialPackages: {
    common: [
      "@development-tools", "git", "curl", "wget", "vim", "nano",
      "python3", "python3-pip", "nodejs", "npm", "ruby",
      "docker", "docker-compose",
      "nginx", "httpd", "postgresql", "redis",
      "openssh-server", "openssl", "firewalld", "fail2ban",
      "htop", "tmux", "zsh", "fish",
    ],
    fedora: [
      "fedora-workstation-repositories",
      "dnf-plugins-core",
      "flatpak",
    ],
    rhel: [
      "subscription-manager",
      "insights-client",
    ],
  },

  // DNF specific settings
  dnf: {
    fastestMirror: true,
    maxParallelDownloads: 10,
    defaultYes: true,
  },

  // SELinux settings
  selinux: {
    mode: "enforcing", // or "permissive", "disabled"
    type: "targeted",
  },

  // Firewall (firewalld)
  firewall: {
    enabled: true,
    defaultZone: "public",
    services: ["ssh", "http", "https"],
  },
};

export default redhatConfig;