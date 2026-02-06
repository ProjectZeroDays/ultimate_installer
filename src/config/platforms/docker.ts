// Docker/container-specific configuration
export const dockerConfig = {
  // Detect if running in container
  detection: {
    files: ["/.dockerenv", "/run/.containerenv"],
    cgroup: "/proc/self/cgroup",
  },

  // Container-optimized settings
  container: {
    isContainer: true,
    skipSystemd: true,
    useSupervisord: false,
    installInit: false,
  },

  // Essential packages for containers (minimal)
  essentialPackages: [
    "curl", "wget", "git", "vim", "nano",
    "ca-certificates", "gnupg", "lsb-release",
    "software-properties-common", "apt-transport-https",
    "python3", "python3-pip",
    "nodejs", "npm",
  ],

  // Security considerations for containers
  security: {
    runAsNonRoot: true,
    readOnlyRootFilesystem: false,
    noNewPrivileges: true,
    dropCapabilities: ["ALL"],
    addCapabilities: [],
  },

  // Volume mounts typically used
  volumes: {
    data: "/data",
    config: "/config",
    logs: "/logs",
    tmp: "/tmp",
  },

  // Health check
  healthCheck: {
    enabled: true,
    interval: "30s",
    timeout: "10s",
    retries: 3,
    startPeriod: "40s",
  },

  // Multi-stage build optimizations
  build: {
    useBuildKit: true,
    squashLayers: false,
    optimizeSize: true,
  },

  // Docker-specific paths
  paths: {
    dockerSocket: "/var/run/docker.sock",
    containerCgroup: "/sys/fs/cgroup",
  },
};

export default dockerConfig;