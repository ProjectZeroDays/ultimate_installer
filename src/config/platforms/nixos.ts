// NixOS configuration - Purely functional Linux distribution
export const nixosConfig = {
  // NixOS detection
  detection: {
    nixosFile: "/etc/NIXOS",
    nixosVersion: "/run/current-system/nixos-version",
    configuration: "/etc/nixos/configuration.nix",
    hardwareConfig: "/etc/nixos/hardware-configuration.nix",
  },

  // Nix package manager settings
  nix: {
    packageManager: "nix",
    systemManager: "nixos-rebuild",
    userManager: "home-manager",
    channels: "/nix/var/nix/profiles/per-user/root/channels",
    store: "/nix/store",
    gcRoots: "/nix/var/nix/gcroots",
  },

  // System configuration
  system: {
    configFile: "/etc/nixos/configuration.nix",
    flakeFile: "/etc/nixos/flake.nix",
    rebuildCommand: "sudo nixos-rebuild switch",
    upgradeCommand: "sudo nixos-rebuild switch --upgrade",
    generations: "/nix/var/nix/profiles/system",
  },

  // Essential system packages (installed via configuration.nix)
  essentialPackages: {
    system: [
      "vim",
      "git",
      "wget",
      "curl",
      "htop",
      "tmux",
    ],
    desktop: [
      "firefox",
      "thunderbird",
      "libreoffice",
      "gimp",
    ],
    development: [
      "gcc",
      "gnumake",
      "cmake",
      "python3",
      "nodePackages.npm",
      "docker",
      "kubectl",
    ],
  },

  // Nix flakes configuration
  flakes: {
    enabled: true,
    experimentalFeatures: ["nix-command", "flakes"],
    registry: "https://github.com/nixos/flake-registry/raw/master/flake-registry.json",
  },

  // Home Manager for user packages
  homeManager: {
    enabled: true,
    configFile: "~/.config/nixpkgs/home.nix",
    standalone: "home-manager switch",
    nixosModule: true,
  },

  // Services commonly enabled
  services: {
    ssh: "services.openssh.enable = true",
    docker: "virtualisation.docker.enable = true",
    podman: "virtualisation.podman.enable = true",
    libvirtd: "virtualisation.libvirtd.enable = true",
    printing: "services.printing.enable = true",
    flatpak: "services.flatpak.enable = true",
  },

  // Hardware-specific settings
  hardware: {
    nvidia: "services.xserver.videoDrivers = [ \"nvidia\" ]",
    amd: "services.xserver.videoDrivers = [ \"amdgpu\" ]",
    intel: "services.xserver.videoDrivers = [ \"intel\" ]",
    bluetooth: "hardware.bluetooth.enable = true",
    pulseaudio: "hardware.pulseaudio.enable = true",
    pipewire: "services.pipewire.enable = true",
  },

  // Filesystem support
  filesystems: {
    btrfs: "boot.supportedFilesystems = [ \"btrfs\" ]",
    zfs: "boot.supportedFilesystems = [ \"zfs\" ]",
    nfs: "fileSystems.\"/mnt/nfs\".fsType = \"nfs\"",
  },

  // Nix store optimization
  optimization: {
    autoGc: "nix.gc.automatic = true",
    autoOptimize: "nix.settings.auto-optimise-store = true",
    allowedUsers: "nix.settings.allowed-users = [ \"@wheel\" ]",
  },

  // Reproducible builds
  reproducible: {
    pinNixpkgs: true,
    useFlakes: true,
    lockFile: "flake.lock",
  },
};

export default nixosConfig;