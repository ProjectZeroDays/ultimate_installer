// Slackware Linux configuration
export const slackwareConfig = {
  detection: {
    id: "slackware",
    releaseFile: "/etc/slackware-version",
    slackware: "/etc/slackware-release",
    slackpkg: "/usr/sbin/slackpkg",
  },

  // Oldest surviving Linux distribution
  base: "Independent",
  founded: "1993",
  init: "BSD-style init scripts", // Not systemd
  philosophy: "KISS - Keep It Simple, Stupid",

  // Package management
  packageManager: {
    name: "slackpkg",
    official: true,
    install: "slackpkg install",
    remove: "slackpkg remove",
    update: "slackpkg update",
    upgrade: "slackpkg upgrade-all",
    search: "slackpkg search",
    fileSearch: "slackpkg file-search",
    info: "slackpkg info",
    cleanCache: "slackpkg clean-system",
    blacklist: "/etc/slackpkg/blacklist",
  },

  // Traditional Slackware packages
  packages: {
    format: ".tgz, .txz",
    metadata: "slack-desc, doinst.sh",
    noDependencyTracking: true, // Manual dependency management
    buildScripts: "/source",
  },

  // Repositories
  repositories: {
    official: {
      mirrors: "/etc/slackpkg/mirrors",
      recommended: "mirrors.slackware.com",
      current: "slackware-current",
      stable: "slackware-15.0",
    },
    thirdParty: {
      slackbuilds: "SBo (SlackBuilds.org)",
      alienBob: "alienBO