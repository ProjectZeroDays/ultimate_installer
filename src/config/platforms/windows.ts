// Windows-specific configuration
export const windowsConfig = {
  // Package managers priority
  packageManagers: [
    { name: "winget", priority: 1, check: "Get-Command winget" },
    { name: "choco", priority: 2, check: "Get-Command choco" },
    { name: "scoop", priority: 3, check: "Get-Command scoop" },
  ],

  // Essential packages via winget
  essentialPackages: [
    "Git.Git",
    "Microsoft.PowerShell",
    "Microsoft.WindowsTerminal",
    "Microsoft.VisualStudioCode",
    "Docker.DockerDesktop",
    "Python.Python.3.11",
    "OpenJS.NodeJS",
    "GoLang.Go",
    "Rustlang.Rust.MSVC",
    "Oracle.JDK.17",
    "JetBrains.IntelliJIDEA.Community",
    "Postman.Postman",
    "GitHub.GitHubDesktop",
  ],

  // Windows-specific tools
  windowsTools: {
    wsl: true,              // Windows Subsystem for Linux
    wslDistros: ["Ubuntu", "Debian", "Kali-Linux"],
    enableDeveloperMode: true,
    enableWSL2: true,
    installWindowsTerminal: true,
  },

  // Security tools available on Windows
  securityTools: [
    "WiresharkFoundation.Wireshark",
    "Nmap.Nmap",
    "GnuPG.Gpg4win",
    "PuTTY.PuTTY",
    "WinSCP.WinSCP",
    "NordVPN.NordVPN",
    "TorProject.TorBrowser",
  ],

  // System tweaks
  tweaks: {
    disableTelemetry: true,
    disableCortana: true,
    enableDarkMode: true,
    showFileExtensions: true,
    enableLongPaths: true,
  },

  // Paths (using Windows environment variables)
  paths: {
    programs: "${ProgramFiles}",
    programsX86: "${ProgramFiles(x86)}",
    localAppData: "${LOCALAPPDATA}",
    roamingAppData: "${APPDATA}",
    temp: "${TEMP}",
    systemRoot: "${SystemRoot}",
  },
};

export default windowsConfig;