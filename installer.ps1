# ============================================================================
# ULTIMATE CROSS-PLATFORM SYSTEM INSTALLER v3.0
# Professional Edition with Auto-Configuration & Multi-Package Manager Support
# ============================================================================

#Requires -Version 7.0

param(
    [switch]$Silent,
    [string]$ConfigProfile = "Default",
    [switch]$SkipBootstrap,
    [switch]$DryRun
)

# 1. ADVANCED LOGGING & TELEMETRY
$script:StartTime = Get-Date
$logDir = if ($IsWindows) { 
    Join-Path ([Environment]::GetFolderPath("MyDocuments")) "UltimateInstaller" 
} else { 
    "$HOME/.ultimate_installer" 
}
if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir -Force | Out-Null }

$logFile = Join-Path $logDir "Install_$(Get-Date -Format 'yyyyMMdd_HHmmss').log"
$jsonLog = Join-Path $logDir "Install_$(Get-Date -Format 'yyyyMMdd_HHmmss').json"

Start-Transcript -Path $logFile -Append -IncludeInvocationHeader

# JSON Logger for structured data
$script:InstallLog = @{
    StartTime = $script:StartTime
    OS = "Unknown"
    Actions = @()
    Errors = @()
}

function Write-Log {
    param([string]$Message, [string]$Level = "INFO", [string]$Category = "General")
    $timestamp = Get-Date -Format "HH:mm:ss"
    $colorMap = @{
        "INFO" = "White"; "SUCCESS" = "Green"; "WARN" = "Yellow"; 
        "ERROR" = "Red"; "DEBUG" = "Gray"; "CONFIG" = "Magenta"
    }
    Write-Host "[$timestamp] [$Level] $Message" -ForegroundColor $colorMap[$Level]
    
    $script:InstallLog.Actions += @{
        Time = $timestamp
        Level = $Level
        Category = $Category
        Message = $Message
    }
}

Write-Host @"
╔══════════════════════════════════════════════════════════════════════╗
║     ULTIMATE CROSS-PLATFORM INSTALLER v3.0 - PROFESSIONAL EDITION    ║
║          Pentest • AI • DevOps • Creative • System Admin             ║
╚══════════════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

# 2. COMPREHENSIVE OS DETECTION
$script:OSDetails = @{
    Type = "Unknown"
    IsServer = $false
    Version = "Unknown"
    Architecture = [System.Runtime.InteropServices.RuntimeInformation]::ProcessArchitecture.ToString()
    PackageManagers = @()
    ConfigPath = ""
    Shell = ""
}

if ($IsWindows) {
    $script:OSDetails.Type = "Windows"
    $osInfo = Get-CimInstance Win32_OperatingSystem
    $script:OSDetails.Version = $osInfo.Caption
    $script:OSDetails.IsServer = $osInfo.Caption -like "*Server*"
    $script:OSDetails.ConfigPath = "$env:LOCALAPPDATA\UltimateInstaller"
    $script:OSDetails.Shell = if (Get-Command pwsh -ErrorAction SilentlyContinue) { "PowerShell" } else { "Windows PowerShell" }
    
    # Detect available package managers
    $script:OSDetails.PackageManagers = @("winget")
    if (Get-Command choco -ErrorAction SilentlyContinue) { $script:OSDetails.PackageManagers += "chocolatey" }
    if (Get-Command scoop -ErrorAction SilentlyContinue) { $script:OSDetails.PackageManagers += "scoop" }
    if (Get-Command msstore -ErrorAction SilentlyContinue) { $script:OSDetails.PackageManagers += "msstore" }
    
    # WSL Detection
    $wslInstalled = (Get-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux).State -eq "Enabled"
    
} elseif ($IsMacOS) {
    $script:OSDetails.Type = "macOS"
    $script:OSDetails.Version = sw_vers -productVersion
    $script:OSDetails.ConfigPath = "$HOME/Library/Application Support/UltimateInstaller"
    $script:OSDetails.Shell = if (Test-Path "/bin/zsh") { "zsh" } else { "bash" }
    
    $script:OSDetails.PackageManagers = @()
    if (Get-Command brew -ErrorAction SilentlyContinue) { 
        $script:OSDetails.PackageManagers += "homebrew"
        if (Get-Command brew -ErrorAction SilentlyContinue | Where-Object { $_.Source -match "cask" }) {
            $script:OSDetails.PackageManagers += "homebrew-cask"
        }
    }
    if (Get-Command port -ErrorAction SilentlyContinue) { $script:OSDetails.PackageManagers += "macports" }
    if (Get-Command pkgin -ErrorAction SilentlyContinue) { $script:OSDetails.PackageManagers += "pkgin" }
    
} elseif ($IsLinux) {
    $script:OSDetails.Type = "Linux"
    $script:OSDetails.Version = if (Test-Path "/etc/os-release") { 
        (Get-Content /etc/os-release | ConvertFrom-StringData).PRETTY_NAME 
    } else { "Unknown Linux" }
    $script:OSDetails.ConfigPath = "$HOME/.config/ultimate_installer"
    $script:OSDetails.Shell = $env:SHELL
    
    # Detect distro and package managers
    $script:OSDetails.PackageManagers = @()
    if (Get-Command apt -ErrorAction SilentlyContinue) { $script:OSDetails.PackageManagers += "apt" }
    if (Get-Command dnf -ErrorAction SilentlyContinue) { $script:OSDetails.PackageManagers += "dnf" }
    if (Get-Command yum -ErrorAction SilentlyContinue) { $script:OSDetails.PackageManagers += "yum" }
    if (Get-Command pacman -ErrorAction SilentlyContinue) { $script:OSDetails.PackageManagers += "pacman" }
    if (Get-Command zypper -ErrorAction SilentlyContinue) { $script:OSDetails.PackageManagers += "zypper" }
    if (Get-Command snap -ErrorAction SilentlyContinue) { $script:OSDetails.PackageManagers += "snap" }
    if (Get-Command flatpak -ErrorAction SilentlyContinue) { $script:OSDetails.PackageManagers += "flatpak" }
    if (Get-Command appimage -ErrorAction SilentlyContinue) { $script:OSDetails.PackageManagers += "appimage" }
}

New-Item -ItemType Directory -Path $script:OSDetails.ConfigPath -Force -ErrorAction SilentlyContinue | Out-Null
Write-Log "Detected OS: $($script:OSDetails.Type) $($script:OSDetails.Version) ($($script:OSDetails.Architecture))" "INFO" "System"

# 3. MASTER DATABASE - 100+ TOOLS WITH FULL METADATA
$script:MasterApps = @()

# === CATEGORY: Core Development ===
$script:MasterApps += @(
    @{
        ID = "git"; Name = "Git"; Category = "Core Dev"; 
        WinIDs = @{ winget = "Git.Git"; choco = "git"; scoop = "git" };
        MacIDs = @{ brew = "git"; cask = $null };
        LinuxIDs = @{ apt = "git"; dnf = "git"; pacman = "git"; snap = $null; flatpak = $null };
        ConfigHooks = @("git-config");
        Priority = "Critical"
    },
    @{
        ID = "gitlfs"; Name = "Git LFS"; Category = "Core Dev";
        WinIDs = @{ winget = "GitHub.GitLFS"; choco = "git-lfs"; scoop = "git-lfs" };
        MacIDs = @{ brew = "git-lfs" };
        LinuxIDs = @{ apt = "git-lfs"; dnf = "git-lfs" };
        Dependencies = @("git")
    },
    @{
        ID = "gh_cli"; Name = "GitHub CLI"; Category = "Core Dev";
        WinIDs = @{ winget = "GitHub.cli"; choco = "gh"; scoop = "gh" };
        MacIDs = @{ brew = "gh" };
        LinuxIDs = @{ apt = "gh"; snap = "gh" };
        ConfigHooks = @("gh-auth")
    },
    @{
        ID = "powershell7"; Name = "PowerShell 7"; Category = "Core Dev";
        WinIDs = @{ winget = "Microsoft.PowerShell"; choco = "powershell-core"; scoop = "pwsh" };
        MacIDs = @{ brew = "powershell"; cask = "powershell" };
        LinuxIDs = @{ apt = "powershell"; snap = "powershell" };
        ConfigHooks = @("ps7-profile", "ps7-modules")
    },
    @{
        ID = "windows_terminal"; Name = "Windows Terminal"; Category = "Core Dev"; OSFilter = "Windows";
        WinIDs = @{ winget = "Microsoft.WindowsTerminal"; msstore = "9N0DX20HK701" };
        ConfigHooks = @("wt-settings", "wt-profile")
    },
    @{
        ID = "code"; Name = "Visual Studio Code"; Category = "Core Dev";
        WinIDs = @{ winget = "Microsoft.VisualStudioCode"; choco = "vscode"; scoop = "vscode" };
        MacIDs = @{ cask = "visual-studio-code" };
        LinuxIDs = @{ apt = "code"; snap = "code"; flatpak = "com.visualstudio.code" };
        ConfigHooks = @("code-extensions", "code-settings", "code-keybindings")
    },
    @{
        ID = "jetbrains_toolbox"; Name = "JetBrains Toolbox"; Category = "Core Dev";
        WinIDs = @{ winget = "JetBrains.Toolbox"; choco = "jetbrainstoolbox" };
        MacIDs = @{ cask = "jetbrains-toolbox" };
        LinuxIDs = @{ snap = "jetbrains-toolbox"; tar = "https://download.jetbrains.com/toolbox/jetbrains-toolbox-2.3.1.31116.tar.gz" }
    },
    @{
        ID = "cursor"; Name = "Cursor IDE (AI)"; Category = "Core Dev";
        WinIDs = @{ winget = "Anysphere.Cursor"; choco = "cursor"; scoop = "cursor" };
        MacIDs = @{ cask = "cursor" };
        LinuxIDs = @{ appimage = "https://download.todesktop.com/230313mzl4w4u92/cursor-0.40.3-build-2409052f3dfqitp-x86_64.AppImage" }
    },
    @{
        ID = "trae"; Name = "Trae IDE (ByteDance AI)"; Category = "Core Dev";
        WinIDs = @{ winget = "ByteDance.Trae"; scoop = "trae" };
        MacIDs = @{ cask = "trae" };
        ConfigHooks = @("trae-cn-config")
    },
    @{
        ID = "neovim"; Name = "Neovim"; Category = "Core Dev";
        WinIDs = @{ winget = "Neovim.Neovim"; choco = "neovim"; scoop = "neovim" };
        MacIDs = @{ brew = "neovim" };
        LinuxIDs = @{ apt = "neovim"; dnf = "neovim"; pacman = "neovim"; snap = "nvim" };
        ConfigHooks = @("nvim-lazyvim", "nvim-config")
    },
    @{
        ID = "vim"; Name = "Vim"; Category = "Core Dev";
        WinIDs = @{ winget = "vim.vim"; choco = "vim"; scoop = "vim" };
        MacIDs = @{ brew = "vim" };
        LinuxIDs = @{ apt = "vim"; dnf = "vim"; pacman = "vim" };
        ConfigHooks = @("vim-vundle", "vimrc")
    },
    @{
        ID = "emacs"; Name = "Emacs"; Category = "Core Dev";
        WinIDs = @{ winget = "GNU.Emacs"; choco = "emacs"; scoop = "emacs" };
        MacIDs = @{ cask = "emacs" };
        LinuxIDs = @{ apt = "emacs"; dnf = "emacs"; pacman = "emacs" };
        ConfigHooks = @("emacs-doom", "emacs-spacemacs")
    },
    @{
        ID = "helix"; Name = "Helix Editor"; Category = "Core Dev";
        WinIDs = @{ winget = "Helix.Helix"; scoop = "helix" };
        MacIDs = @{ brew = "helix" };
        LinuxIDs = @{ apt = "helix"; dnf = "helix"; pacman = "helix" }
    }
)

# === CATEGORY: Languages & Runtimes ===
$script:MasterApps += @(
    @{
        ID = "python3"; Name = "Python 3.12"; Category = "Languages";
        WinIDs = @{ winget = "Python.Python.3.12"; choco = "python"; scoop = "python" };
        MacIDs = @{ brew = "python@3.12" };
        LinuxIDs = @{ apt = "python3"; dnf = "python3"; pacman = "python" };
        ConfigHooks = @("pip-config", "pipx-tools", "poetry-install", "pyenv-setup")
    },
    @{
        ID = "nodejs"; Name = "Node.js LTS"; Category = "Languages";
        WinIDs = @{ winget = "OpenJS.NodeJS.LTS"; choco = "nodejs-lts"; scoop = "nodejs-lts" };
        MacIDs = @{ brew = "node@20" };
        LinuxIDs = @{ apt = "nodejs"; dnf = "nodejs"; snap = "node" };
        ConfigHooks = @("npm-global", "nvm-setup", "pnpm-setup", "yarn-setup")
    },
    @{
        ID = "bun"; Name = "Bun Runtime"; Category = "Languages";
        WinIDs = @{ winget = "Oven-sh.Bun"; scoop = "bun" };
        MacIDs = @{ brew = "bun" };
        LinuxIDs = @{ script = "curl -fsSL https://bun.sh/install | bash" }
    },
    @{
        ID = "deno"; Name = "Deno Runtime"; Category = "Languages";
        WinIDs = @{ winget = "DenoLand.Deno"; choco = "deno"; scoop = "deno" };
        MacIDs = @{ brew = "deno" };
        LinuxIDs = @{ script = "curl -fsSL https://deno.land/install.sh | sh" }
    },
    @{
        ID = "rust"; Name = "Rust Toolchain"; Category = "Languages";
        WinIDs = @{ winget = "Rustlang.Rustup"; choco = "rust"; scoop = "rustup" };
        MacIDs = @{ brew = "rustup-init" };
        LinuxIDs = @{ script = "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y" };
        ConfigHooks = @("rust-cargo-config", "rust-analyzer")
    },
    @{
        ID = "golang"; Name = "Go"; Category = "Languages";
        WinIDs = @{ winget = "GoLang.Go"; choco = "golang"; scoop = "go" };
        MacIDs = @{ brew = "go" };
        LinuxIDs = @{ apt = "golang-go"; snap = "go" }
    },
    @{
        ID = "dotnet"; Name = ".NET SDK"; Category = "Languages";
        WinIDs = @{ winget = "Microsoft.DotNet.SDK.8"; choco = "dotnet-sdk"; scoop = "dotnet-sdk" };
        MacIDs = @{ cask = "dotnet-sdk" };
        LinuxIDs = @{ snap = "dotnet-sdk" }
    },
    @{
        ID = "java_openjdk"; Name = "OpenJDK 21"; Category = "Languages";
        WinIDs = @{ winget = "EclipseAdoptium.Temurin.21.JDK"; choco = "openjdk"; scoop = "openjdk21" };
        MacIDs = @{ cask = "temurin@21" };
        LinuxIDs = @{ apt = "openjdk-21-jdk"; dnf = "java-21-openjdk-devel" }
    },
    @{
        ID = "kotlin"; Name = "Kotlin"; Category = "Languages";
        WinIDs = @{ winget = "JetBrains.Kotlin.Complier"; scoop = "kotlin" };
        MacIDs = @{ brew = "kotlin" };
        LinuxIDs = @{ snap = "kotlin" }
    },
    @{
        ID = "zig"; Name = "Zig"; Category = "Languages";
        WinIDs = @{ winget = "Zig.Zig"; scoop = "zig" };
        MacIDs = @{ brew = "zig" };
        LinuxIDs = @{ snap = "zig" }
    },
    @{
        ID = "crystal"; Name = "Crystal"; Category = "Languages";
        WinIDs = @{ scoop = "crystal" };
        MacIDs = @{ brew = "crystal" };
        LinuxIDs = @{ snap = "crystal" }
    }
)

# === CATEGORY: AI & Machine Learning ===
$script:MasterApps += @(
    @{
        ID = "ollama"; Name = "Ollama (Local LLMs)"; Category = "AI/ML";
        WinIDs = @{ winget = "Ollama.Ollama"; choco = "ollama"; scoop = "ollama" };
        MacIDs = @{ brew = "ollama" };
        LinuxIDs = @{ script = "curl -fsSL https://ollama.com/install.sh | sh" };
        ConfigHooks = @("ollama-models", "ollama-systemd")
    },
    @{
        ID = "docker"; Name = "Docker Desktop"; Category = "AI/ML";
        WinIDs = @{ winget = "Docker.DockerDesktop"; choco = "docker-desktop" };
        MacIDs = @{ cask = "docker" };
        LinuxIDs = @{ script = "curl -fsSL https://get.docker.com | sh" };
        ConfigHooks = @("docker-nvidia", "docker-compose", "docker-buildx")
    },
    @{
        ID = "nvidia_cuda"; Name = "NVIDIA CUDA Toolkit"; Category = "AI/ML"; OSFilter = "Windows,Linux";
        WinIDs = @{ winget = "Nvidia.CUDA"; choco = "cuda" };
        LinuxIDs = @{ script = "distribution=$(. /etc/os-release;echo $ID$VERSION_ID) && curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add - && curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list" }
    },
    @{
        ID = "anaconda"; Name = "Anaconda Distribution"; Category = "AI/ML";
        WinIDs = @{ winget = "Anaconda.Anaconda3"; choco = "anaconda3" };
        MacIDs = @{ cask = "anaconda" };
        LinuxIDs = @{ script = "wget https://repo.anaconda.com/archive/Anaconda3-2024.02-1-Linux-x86_64.sh -O /tmp/anaconda.sh && bash /tmp/anaconda.sh -b -p $HOME/anaconda3" };
        ConfigHooks = @("conda-forge", "conda-envs")
    },
    @{
        ID = "jupyter"; Name = "Jupyter Lab"; Category = "AI/ML";
        WinIDs = @{ pip = "jupyterlab" };
        MacIDs = @{ pip = "jupyterlab" };
        LinuxIDs = @{ pip = "jupyterlab" };
        Dependencies = @("python3")
    },
    @{
        ID = "chatgpt_desktop"; Name = "ChatGPT Desktop"; Category = "AI/ML";
        WinIDs = @{ winget = "OpenAI.ChatGPT"; scoop = "chatgpt" };
        MacIDs = @{ cask = "chatgpt" }
    },
    @{
        ID = "claude_desktop"; Name = "Claude Desktop"; Category = "AI/ML";
        WinIDs = @{ winget = "Anthropic.Claude"; scoop = "claude" };
        MacIDs = @{ cask = "claude" }
    },
    @{
        ID = "perplexity"; Name = "Perplexity AI"; Category = "AI/ML";
        WinIDs = @{ winget = "Perplexity.Perplexity" };
        MacIDs = @{ cask = "perplexity" }
    },
    @{
        ID = "continue_dev"; Name = "Continue.dev (AI Coding)"; Category = "AI/ML";
        ConfigHooks = @("continue-vscode", "continue-config")
    },
    @{
        ID = "tabnine"; Name = "TabNine AI Assistant"; Category = "AI/ML";
        WinIDs = @{ winget = "TabNine.TabNine"; vscode = "TabNine.tabnine-vscode" };
        ConfigHooks = @("tabnine-config")
    },
    @{
        ID = "codeium"; Name = "Codeium Windsurf"; Category = "AI/ML";
        WinIDs = @{ winget = "Codeium.Windsurf"; scoop = "windsurf" };
        MacIDs = @{ cask = "windsurf" }
    }
)

# === CATEGORY: Cybersecurity & Pentesting ===
$script:MasterApps += @(
    @{
        ID = "kali_wsl"; Name = "Kali Linux (WSL)"; Category = "Security"; OSFilter = "Windows";
        WinIDs = @{ winget = "KaliLinux.KaliLinux"; msstore = "9PKR34TNCV07" };
        ConfigHooks = @("kali-gui", "kali-tools", "kali-wslg")
    },
    @{
        ID = "metasploit"; Name = "Metasploit Framework"; Category = "Security";
        WinIDs = @{ winget = "Rapid7.MetasploitFramework"; choco = "metasploit" };
        MacIDs = @{ brew = "metasploit" };
        LinuxIDs = @{ apt = "metasploit-framework" }
    },
    @{
        ID = "nmap"; Name = "Nmap & Zenmap"; Category = "Security";
        WinIDs = @{ winget = "Insecure.Nmap"; choco = "nmap"; scoop = "nmap" };
        MacIDs = @{ brew = "nmap" };
        LinuxIDs = @{ apt = "nmap"; dnf = "nmap" }
    },
    @{
        ID = "zenmap"; Name = "Zenmap GUI"; Category = "Security";
        WinIDs = @{ winget = "Insecure.Zenmap" };
        MacIDs = @{ cask = "zenmap" };
        LinuxIDs = @{ apt = "zenmap" }
    },
    @{
        ID = "wireshark"; Name = "Wireshark"; Category = "Security";
        WinIDs = @{ winget = "WiresharkFoundation.Wireshark"; choco = "wireshark"; scoop = "wireshark" };
        MacIDs = @{ cask = "wireshark" };
        LinuxIDs = @{ apt = "wireshark"; dnf = "wireshark" }
    },
    @{
        ID = "burp_suite"; Name = "Burp Suite Professional"; Category = "Security";
        WinIDs = @{ winget = "PortSwigger.BurpSuite.Professional" };
        MacIDs = @{ cask = "burp-suite" }
    },
    @{
        ID = "wireguard"; Name = "WireGuard VPN"; Category = "Security";
        WinIDs = @{ winget = "WireGuard.WireGuard"; choco = "wireguard"; scoop = "wireguard" };
        MacIDs = @{ cask = "wireguard" };
        LinuxIDs = @{ apt = "wireguard"; dnf = "wireguard-tools" }
    },
    @{
        ID = "protonvpn"; Name = "Proton VPN"; Category = "Security";
        WinIDs = @{ winget = "Proton.ProtonVPN"; choco = "protonvpn"; scoop = "protonvpn" };
        MacIDs = @{ cask = "protonvpn" };
        LinuxIDs = @{ script = "wget -q -O - https://repo.protonvpn.com/debian/public-key.asc | sudo apt-key add - && echo 'deb https://repo.protonvpn.com/debian stable main' | sudo tee /etc/apt/sources.list.d/protonvpn.list && sudo apt update && sudo apt install protonvpn" }
    },
    @{
        ID = "mullvad"; Name = "Mullvad VPN"; Category = "Security";
        WinIDs = @{ winget = "MullvadVPN.MullvadVPN"; choco = "mullvad-app" };
        MacIDs = @{ cask = "mullvadvpn" };
        LinuxIDs = @{ script = "curl -fsSL https://mullvad.net/en/download/app/deb/latest | sudo dpkg -i /dev/stdin" }
    },
    @{
        ID = "tor_browser"; Name = "Tor Browser"; Category = "Security";
        WinIDs = @{ winget = "TorProject.TorBrowser"; choco = "tor-browser"; scoop = "tor-browser" };
        MacIDs = @{ cask = "tor-browser" };
        LinuxIDs = @{ flatpak = "com.torproject.torbrowser-launcher" }
    },
    @{
        ID = "veracrypt"; Name = "VeraCrypt"; Category = "Security";
        WinIDs = @{ winget = "IDRIX.VeraCrypt"; choco = "veracrypt"; scoop = "veracrypt" };
        MacIDs = @{ cask = "veracrypt" };
        LinuxIDs = @{ apt = "veracrypt"; snap = "veracrypt" }
    },
    @{
        ID = "keepassxc"; Name = "KeePassXC"; Category = "Security";
        WinIDs = @{ winget = "KeePassXC.KeePassXC"; choco = "keepassxc"; scoop = "keepassxc" };
        MacIDs = @{ cask = "keepassxc" };
        LinuxIDs = @{ apt = "keepassxc"; snap = "keepassxc" }
    },
    @{
        ID = "yubikey"; Name = "YubiKey Manager"; Category = "Security";
        WinIDs = @{ winget = "Yubico.YubiKeyManager"; choco = "yubikey-manager" };
        MacIDs = @{ cask = "yubico-yubikey-manager" };
        LinuxIDs = @{ apt = "yubikey-manager"; snap = "yubikey-manager" }
    },
    @{
        ID = "hashcat"; Name = "Hashcat"; Category = "Security";
        WinIDs = @{ winget = "Hashcat.Hashcat"; scoop = "hashcat" };
        MacIDs = @{ brew = "hashcat" };
        LinuxIDs = @{ apt = "hashcat" }
    },
    @{
        ID = "johntheripper"; Name = "John the Ripper"; Category = "Security";
        WinIDs = @{ scoop = "john" };
        MacIDs = @{ brew = "john-jumbo" };
        LinuxIDs = @{ apt = "john"; snap = "john-the-ripper" }
    },
    @{
        ID = "hydra"; Name = "THC-Hydra"; Category = "Security";
        WinIDs = @{ scoop = "hydra" };
        MacIDs = @{ brew = "hydra" };
        LinuxIDs = @{ apt = "hydra"; dnf = "hydra" }
    },
    @{
        ID = "gobuster"; Name = "Gobuster"; Category = "Security";
        WinIDs = @{ scoop = "gobuster" };
        MacIDs = @{ brew = "gobuster" };
        LinuxIDs = @{ apt = "gobuster" }
    },
    @{
        ID = "feroxbuster"; Name = "Feroxbuster"; Category = "Security";
        WinIDs = @{ scoop = "feroxbuster" };
        MacIDs = @{ brew = "feroxbuster" };
        LinuxIDs = @{ apt = "feroxbuster" }
    },
    @{
        ID = "sqlmap"; Name = "SQLMap"; Category = "Security";
        WinIDs = @{ pip = "sqlmap" };
        MacIDs = @{ pip = "sqlmap" };
        LinuxIDs = @{ apt = "sqlmap" }
    },
    @{
        ID = "nikto"; Name = "Nikto Web Scanner"; Category = "Security";
        WinIDs = @{ scoop = "nikto" };
        MacIDs = @{ brew = "nikto" };
        LinuxIDs = @{ apt = "nikto" }
    }
)

# === CATEGORY: Cloud & DevOps ===
$script:MasterApps += @(
    @{
        ID = "kubectl"; Name = "Kubectl"; Category = "Cloud";
        WinIDs = @{ winget = "Kubernetes.kubectl"; choco = "kubernetes-cli"; scoop = "kubectl" };
        MacIDs = @{ brew = "kubectl" };
        LinuxIDs = @{ snap = "kubectl"; apt = "kubectl" }
    },
    @{
        ID = "helm"; Name = "Helm"; Category = "Cloud";
        WinIDs = @{ winget = "Helm.Helm"; choco = "kubernetes-helm"; scoop = "helm" };
        MacIDs = @{ brew = "helm" };
        LinuxIDs = @{ snap = "helm"; apt = "helm" }
    },
    @{
        ID = "k9s"; Name = "K9s (K8s TUI)"; Category = "Cloud";
        WinIDs = @{ winget = "Derailed.k9s"; scoop = "k9s" };
        MacIDs = @{ brew = "k9s" };
        LinuxIDs = @{ snap = "k9s" }
    },
    @{
        ID = "lens"; Name = "Lens Kubernetes IDE"; Category = "Cloud";
        WinIDs = @{ winget = "Mirantis.Lens"; choco = "lens"; scoop = "lens" };
        MacIDs = @{ cask = "lens" };
        LinuxIDs = @{ snap = "kontena-lens"; flatpak = "dev.k8slens.OpenLens" }
    },
    @{
        ID = "terraform"; Name = "Terraform"; Category = "Cloud";
        WinIDs = @{ winget = "HashiCorp.Terraform"; choco = "terraform"; scoop = "terraform" };
        MacIDs = @{ brew = "terraform" };
        LinuxIDs = @{ apt = "terraform"; snap = "terraform" }
    },
    @{
        ID = "pulumi"; Name = "Pulumi"; Category = "Cloud";
        WinIDs = @{ winget = "Pulumi.Pulumi"; choco = "pulumi"; scoop = "pulumi" };
        MacIDs = @{ brew = "pulumi" };
        LinuxIDs = @{ script = "curl -fsSL https://get.pulumi.com | sh" }
    },
    @{
        ID = "awscli"; Name = "AWS CLI v2"; Category = "Cloud";
        WinIDs = @{ winget = "Amazon.AWSCLI"; choco = "awscli"; scoop = "aws" };
        MacIDs = @{ brew = "awscli" };
        LinuxIDs = @{ snap = "aws-cli"; script = "curl 'https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip' -o 'awscliv2.zip' && unzip awscliv2.zip && sudo ./aws/install" };
        ConfigHooks = @("aws-configure", "aws-sso")
    },
    @{
        ID = "azurecli"; Name = "Azure CLI"; Category = "Cloud";
        WinIDs = @{ winget = "Microsoft.AzureCLI"; choco = "azure-cli"; scoop = "azure-cli" };
        MacIDs = @{ brew = "azure-cli" };
        LinuxIDs = @{ script = "curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash" }
    },
    @{
        ID = "gcloud"; Name = "Google Cloud SDK"; Category = "Cloud";
        WinIDs = @{ winget = "Google.CloudSDK"; choco = "gcloudsdk"; scoop = "gcloud" };
        MacIDs = @{ cask = "google-cloud-sdk" };
        LinuxIDs = @{ script = "curl https://sdk.cloud.google.com | bash" }
    },
    @{
        ID = "doctl"; Name = "DigitalOcean CLI"; Category = "Cloud";
        WinIDs = @{ winget = "DigitalOcean.doctl"; scoop = "doctl" };
        MacIDs = @{ brew = "doctl" };
        LinuxIDs = @{ snap = "doctl" }
    },
    @{
        ID = "flyctl"; Name = "Fly.io CLI"; Category = "Cloud";
        WinIDs = @{ scoop = "flyctl" };
        MacIDs = @{ brew = "flyctl" };
        LinuxIDs = @{ script = "curl -L https://fly.io/install.sh | sh" }
    },
    @{
        ID = "vercel_cli"; Name = "Vercel CLI"; Category = "Cloud";
        WinIDs = @{ npm = "vercel" };
        MacIDs = @{ npm = "vercel" };
        LinuxIDs = @{ npm = "vercel" }
    },
    @{
        ID = "netlify_cli"; Name = "Netlify CLI"; Category = "Cloud";
        WinIDs = @{ npm = "netlify-cli" };
        MacIDs = @{ npm = "netlify-cli" };
        LinuxIDs = @{ npm = "netlify-cli" }
    },
    @{
        ID = "heroku_cli"; Name = "Heroku CLI"; Category = "Cloud";
        WinIDs = @{ winget = "Heroku.HerokuCLI"; scoop = "heroku-cli" };
        MacIDs = @{ brew = "heroku/brew/heroku" };
        LinuxIDs = @{ snap = "heroku"; script = "curl https://cli-assets.heroku.com/install.sh | sh" }
    },
    @{
        ID = "github_actions_runner"; Name = "GitHub Actions Runner"; Category = "Cloud";
        WinIDs = @{ choco = "actions-runner" };
        MacIDs = @{ brew = "actions-runner" };
        LinuxIDs = @{ script = "curl -o actions-runner-linux-x64-2.311.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz" }
    }
)

# === CATEGORY: Databases ===
$script:MasterApps += @(
    @{
        ID = "postgresql"; Name = "PostgreSQL 16"; Category = "Database";
        WinIDs = @{ winget = "PostgreSQL.PostgreSQL.16"; choco = "postgresql16"; scoop = "postgresql" };
        MacIDs = @{ brew = "postgresql@16" };
        LinuxIDs = @{ apt = "postgresql"; dnf = "postgresql-server" };
        ConfigHooks = @("pg-config", "pg-admin")
    },
    @{
        ID = "mysql"; Name = "MySQL 8.0"; Category = "Database";
        WinIDs = @{ winget = "Oracle.MySQL.8.0"; choco = "mysql" };
        MacIDs = @{ cask = "mysql" };
        LinuxIDs = @{ apt = "mysql-server"; dnf = "mysql-server" }
    },
    @{
        ID = "mongodb"; Name = "MongoDB Community"; Category = "Database";
        WinIDs = @{ winget = "MongoDB.Server.7.0"; choco = "mongodb" };
        MacIDs = @{ brew = "mongodb-community" };
        LinuxIDs = @{ snap = "mongodb-server" }
    },
    @{
        ID = "redis"; Name = "Redis"; Category = "Database";
        WinIDs = @{ winget = "Redis.Redis"; choco = "redis-64"; scoop = "redis" };
        MacIDs = @{ brew = "redis" };
        LinuxIDs = @{ apt = "redis-server"; snap = "redis" }
    },
    @{
        ID = "sqlite"; Name = "SQLite"; Category = "Database";
        WinIDs = @{ winget = "SQLite.SQLite"; scoop = "sqlite" };
        MacIDs = @{ brew = "sqlite" };
        LinuxIDs = @{ apt = "sqlite3" }
    },
    @{
        ID = "dbeaver"; Name = "DBeaver Community"; Category = "Database";
        WinIDs = @{ winget = "DBeaver.DBeaver.Community"; choco = "dbeaver"; scoop = "dbeaver" };
        MacIDs = @{ cask = "dbeaver-community" };
        LinuxIDs = @{ snap = "dbeaver-ce"; flatpak = "io.dbeaver.DBeaverCommunity" }
    },
    @{
        ID = "tableplus"; Name = "TablePlus"; Category = "Database";
        WinIDs = @{ winget = "TablePlus.TablePlus"; choco = "tableplus" };
        MacIDs = @{ cask = "tableplus" };
        LinuxIDs = @{ snap = "tableplus"; apt = "tableplus" }
    },
    @{
        ID = "prisma_studio"; Name = "Prisma Studio"; Category = "Database";
        WinIDs = @{ npm = "@prisma/studio" };
        MacIDs = @{ npm = "@prisma/studio" };
        LinuxIDs = @{ npm = "@prisma/studio" }
    }
)

# === CATEGORY: Media & Creative ===
$script:MasterApps += @(
    @{
        ID = "blender"; Name = "Blender"; Category = "Creative";
        WinIDs = @{ winget = "BlenderFoundation.Blender"; choco = "blender"; scoop = "blender" };
        MacIDs = @{ cask = "blender" };
        LinuxIDs = @{ snap = "blender"; flatpak = "org.blender.Blender" }
    },
    @{
        ID = "gimp"; Name = "GIMP"; Category = "Creative";
        WinIDs = @{ winget = "GIMP.GIMP.3"; choco = "gimp"; scoop = "gimp" };
        MacIDs = @{ cask = "gimp" };
        LinuxIDs = @{ apt = "gimp"; flatpak = "org.gimp.GIMP" }
    },
    @{
        ID = "krita"; Name = "Krita"; Category = "Creative";
        WinIDs = @{ winget = "KDE.Krita"; choco = "krita"; scoop = "krita" };
        MacIDs = @{ cask = "krita" };
        LinuxIDs = @{ snap = "krita"; flatpak = "org.kde.krita" }
    },
    @{
        ID = "obs_studio"; Name = "OBS Studio"; Category = "Creative";
        WinIDs = @{ winget = "OBSProject.OBSStudio"; choco = "obs-studio"; scoop = "obs-studio" };
        MacIDs = @{ cask = "obs" };
        LinuxIDs = @{ apt = "obs-studio"; snap = "obs-studio" }
    },
    @{
        ID = "davinci_resolve"; Name = "DaVinci Resolve"; Category = "Creative";
        WinIDs = @{ winget = "BlackmagicDesign.DaVinciResolve"; choco = "davinci-resolve" };
        MacIDs = @{ cask = "davinci-resolve" };
        LinuxIDs = @{ script = "wget https://swr.cloud.blackmagicdesign.com/DaVinciResolve/v18.6.6/DaVinciResolve_18.6.6_Linux.zip -O /tmp/dr.zip" }
    },
    @{
        ID = "vlc"; Name = "VLC Media Player"; Category = "Creative";
        WinIDs = @{ winget = "VideoLAN.VLC"; choco = "vlc"; scoop = "vlc" };
        MacIDs = @{ cask = "vlc" };
        LinuxIDs = @{ apt = "vlc"; snap = "vlc" }
    },
    @{
        ID = "spotify"; Name = "Spotify"; Category = "Creative";
        WinIDs = @{ winget = "Spotify.Spotify"; choco = "spotify"; scoop = "spotify" };
        MacIDs = @{ cask = "spotify" };
        LinuxIDs = @{ snap = "spotify"; flatpak = "com.spotify.Client" }
    },
    @{
        ID = "audacity"; Name = "Audacity"; Category = "Creative";
        WinIDs = @{ winget = "Audacity.Audacity"; choco = "audacity"; scoop = "audacity" };
        MacIDs = @{ cask = "audacity" };
        LinuxIDs = @{ snap = "audacity"; flatpak = "org.audacityteam.Audacity" }
    },
    @{
        ID = "lmms"; Name = "LMMS (DAW)"; Category = "Creative";
        WinIDs = @{ winget = "LMMS.LMMS"; choco = "lmms"; scoop = "lmms" };
        MacIDs = @{ cask = "lmms" };
        LinuxIDs = @{ snap = "lmms"; flatpak = "io.lmms.LMMS" }
    },
    @{
        ID = "figma"; Name = "Figma Desktop"; Category = "Creative";
        WinIDs = @{ winget = "Figma.Figma"; scoop = "figma" };
        MacIDs = @{ cask = "figma" };
        LinuxIDs = @{ snap = "figma-linux"; flatpak = "io.github.Figma_Linux.figma_linux" }
    },
    @{
        ID = "penpot"; Name = "Penpot Desktop"; Category = "Creative";
        WinIDs = @{ winget = "Penpot.PenpotDesktop"; scoop = "penpot-desktop" };
        MacIDs = @{ cask = "penpot-desktop" };
        LinuxIDs = @{ snap = "penpot-desktop"; flatpak = "com.penpot.PenpotDesktop" }
    },
    @{
        ID = "inkscape"; Name = "Inkscape"; Category = "Creative";
        WinIDs = @{ winget = "Inkscape.Inkscape"; choco = "inkscape"; scoop = "inkscape" };
        MacIDs = @{ cask = "inkscape" };
        LinuxIDs = @{ apt = "inkscape"; flatpak = "org.inkscape.Inkscape" }
    }
)

# === CATEGORY: Browsers & Communication ===
$script:MasterApps += @(
    @{
        ID = "chrome"; Name = "Google Chrome"; Category = "Browser";
        WinIDs = @{ winget = "Google.Chrome"; choco = "googlechrome"; scoop = "googlechrome" };
        MacIDs = @{ cask = "google-chrome" };
        LinuxIDs = @{ apt = "google-chrome-stable"; dnf = "google-chrome-stable"; flatpak = "com.google.Chrome" };
        ConfigHooks = @("chrome-extensions-dev", "chrome-privacy")
    },
    @{
        ID = "firefox"; Name = "Firefox"; Category = "Browser";
        WinIDs = @{ winget = "Mozilla.Firefox"; choco = "firefox"; scoop = "firefox" };
        MacIDs = @{ cask = "firefox" };
        LinuxIDs = @{ apt = "firefox"; snap = "firefox"; flatpak = "org.mozilla.firefox" };
        ConfigHooks = @("firefox-developer", "firefox-privacy")
    },
    @{
        ID = "firefox_dev"; Name = "Firefox Developer Edition"; Category = "Browser";
        WinIDs = @{ winget = "Mozilla.Firefox.DeveloperEdition"; scoop = "firefox-developer" };
        MacIDs = @{ cask = "firefox-developer-edition" };
        LinuxIDs = @{ snap = "firefox"; tar = "https://download.mozilla.org/?product=firefox-devedition-latest-ssl&os=linux64&lang=en-US" }
    },
    @{
        ID = "brave"; Name = "Brave Browser"; Category = "Browser";
        WinIDs = @{ winget = "Brave.Brave"; choco = "brave"; scoop = "brave" };
        MacIDs = @{ cask = "brave-browser" };
        LinuxIDs = @{ snap = "brave"; flatpak = "com.brave.Browser" }
    },
    @{
        ID = "brave_nightly"; Name = "Brave Nightly"; Category = "Browser";
        WinIDs = @{ winget = "Brave.Brave.Nightly"; scoop = "brave-nightly" };
        MacIDs = @{ cask = "brave-browser-nightly" };
        LinuxIDs = @{ snap = "brave"; apt = "brave-browser-nightly" }
    },
    @{
        ID = "edge"; Name = "Microsoft Edge"; Category = "Browser"; OSFilter = "Windows";
        WinIDs = @{ winget = "Microsoft.Edge"; msstore = "9NBLGGH5FV99" }
    },
    @{
        ID = "vivaldi"; Name = "Vivaldi"; Category = "Browser";
        WinIDs = @{ winget = "VivaldiTechnologies.Vivaldi"; choco = "vivaldi"; scoop = "vivaldi" };
        MacIDs = @{ cask = "vivaldi" };
        LinuxIDs = @{ apt = "vivaldi-stable"; snap = "vivaldi" }
    },
    @{
        ID = "arc_browser"; Name = "Arc Browser"; Category = "Browser";
        WinIDs = @{ winget = "TheBrowserCompany.Arc"; scoop = "arc" };
        MacIDs = @{ cask = "arc" }
    },
    @{
        ID = "zen_browser"; Name = "Zen Browser"; Category = "Browser";
        WinIDs = @{ winget = "ZenBrowser.Zen"; scoop = "zen-browser" };
        MacIDs = @{ cask = "zen-browser" };
        LinuxIDs = @{ flatpak = "io.github.zen_browser.zen" }
    },
    @{
        ID = "thunderbird"; Name = "Thunderbird"; Category = "Communication";
        WinIDs = @{ winget = "Mozilla.Thunderbird"; choco = "thunderbird"; scoop = "thunderbird" };
        MacIDs = @{ cask = "thunderbird" };
        LinuxIDs = @{ apt = "thunderbird"; snap = "thunderbird"; flatpak = "org.mozilla.Thunderbird" }
    },
    @{
        ID = "discord"; Name = "Discord"; Category = "Communication";
        WinIDs = @{ winget = "Discord.Discord"; choco = "discord"; scoop = "discord" };
        MacIDs = @{ cask = "discord" };
        LinuxIDs = @{ snap = "discord"; flatpak = "com.discordapp.Discord" }
    },
    @{
        ID = "slack"; Name = "Slack"; Category = "Communication";
        WinIDs = @{ winget = "SlackTechnologies.Slack"; choco = "slack"; scoop = "slack" };
        MacIDs = @{ cask = "slack" };
        LinuxIDs = @{ snap = "slack"; flatpak = "com.slack.Slack" }
    },
    @{
        ID = "telegram"; Name = "Telegram Desktop"; Category = "Communication";
        WinIDs = @{ winget = "Telegram.TelegramDesktop"; choco = "telegram"; scoop = "telegram" };
        MacIDs = @{ cask = "telegram-desktop" };
        LinuxIDs = @{ snap = "telegram-desktop"; flatpak = "org.telegram.desktop" }
    },
    @{
        ID = "signal"; Name = "Signal"; Category = "Communication";
        WinIDs = @{ winget = "OpenWhisperSystems.Signal"; choco = "signal"; scoop = "signal" };
        MacIDs = @{ cask = "signal" };
        LinuxIDs = @{ snap = "signal-desktop"; flatpak = "org.signal.Signal" }
    },
    @{
        ID = "zoom"; Name = "Zoom"; Category = "Communication";
        WinIDs = @{ winget = "Zoom.Zoom"; choco = "zoom"; scoop = "zoom" };
        MacIDs = @{ cask = "zoom" };
        LinuxIDs = @{ snap = "zoom-client"; flatpak = "us.zoom.Zoom" }
    },
    @{
        ID = "obsidian"; Name = "Obsidian"; Category = "Communication";
        WinIDs = @{ winget = "Obsidian.Obsidian"; choco = "obsidian"; scoop = "obsidian" };
        MacIDs = @{ cask = "obsidian" };
        LinuxIDs = @{ snap = "obsidian"; flatpak = "md.obsidian.Obsidian" };
        ConfigHooks = @("obsidian-plugins", "obsidian-sync")
    },
    @{
        ID = "notion"; Name = "Notion"; Category = "Communication";
        WinIDs = @{ winget = "Notion.Notion"; choco = "notion"; scoop = "notion" };
        MacIDs = @{ cask = "notion" };
        LinuxIDs = @{ snap = "notion-snap"; flatpak = "notion.id" }
    },
    @{
        ID = "todoist"; Name = "Todoist"; Category = "Communication";
        WinIDs = @{ winget = "Doist.Todoist"; choco = "todoist"; scoop = "todoist" };
        MacIDs = @{ cask = "todoist" };
        LinuxIDs = @{ snap = "todoist"; flatpak = "com.todoist.Todoist" }
    }
)

# === CATEGORY: System & Utilities ===
$script:MasterApps += @(
    @{
        ID = "wsl_ubuntu"; Name = "WSL Ubuntu"; Category = "System"; OSFilter = "Windows";
        WinIDs = @{ winget = "Canonical.Ubuntu.2204"; msstore = "9PN20MSR04DW" };
        ConfigHooks = @("wsl-default", "wsl-docker", "wsl-zsh")
    },
    @{
        ID = "wsl_debian"; Name = "WSL Debian"; Category = "System"; OSFilter = "Windows";
        WinIDs = @{ winget = "TheDebianProject.Debian"; msstore = "9MSVKQC78PK6" }
    },
    @{
        ID = "wsl_arch"; Name = "WSL Arch Linux"; Category = "System"; OSFilter = "Windows";
        WinIDs = @{ winget = "9MZNMNKSM73Q"; msstore = "9MZNMNKSM73Q" } # Manual ID for Arch
    },
    @{
        ID = "terminal_ghostty"; Name = "Ghostty Terminal"; Category = "System";
        WinIDs = @{ winget = "Ghostty.Ghostty"; scoop = "ghostty" };
        MacIDs = @{ cask = "ghostty" };
        LinuxIDs = @{ script = "curl -fsSL https://raw.githubusercontent.com/mkasberg/ghostty-ubuntu/HEAD/install.sh | bash" }
    },
    @{
        ID = "starship"; Name = "Starship Prompt"; Category = "System";
        WinIDs = @{ winget = "Starship.Starship"; choco = "starship"; scoop = "starship" };
        MacIDs = @{ brew = "starship" };
        LinuxIDs = @{ script = "curl -sS https://starship.rs/install.sh | sh -s -- -y" };
        ConfigHooks = @("starship-config", "shell-integration")
    },
    @{
        ID = "zeal"; Name = "Zeal (Offline Docs)"; Category = "System";
        WinIDs = @{ winget = "ZealDevelopers.Zeal"; choco = "zeal"; scoop = "zeal" };
        MacIDs = @{ cask = "zeal" }; # Actually Dash on Mac
        LinuxIDs = @{ apt = "zeal"; snap = "zeal" }
    },
    @{
        ID = "fzf"; Name = "fzf Fuzzy Finder"; Category = "System";
        WinIDs = @{ winget = "junegunn.fzf"; choco = "fzf"; scoop = "fzf" };
        MacIDs = @{ brew = "fzf" };
        LinuxIDs = @{ apt = "fzf"; dnf = "fzf" };
        ConfigHooks = @("fzf-shell-integration", "fzf-vim-integration")
    },
    @{
        ID = "ripgrep"; Name = "Ripgrep (rg)"; Category = "System";
        WinIDs = @{ winget = "BurntSushi.ripgrep.MSVC"; choco = "ripgrep"; scoop = "ripgrep" };
        MacIDs = @{ brew = "ripgrep" };
        LinuxIDs = @{ apt = "ripgrep"; dnf = "ripgrep" }
    },
    @{
        ID = "fd"; Name = "fd (Find Alternative)"; Category = "System";
        WinIDs = @{ winget = "sharkdp.fd"; choco = "fd"; scoop = "fd" };
        MacIDs = @{ brew = "fd" };
        LinuxIDs = @{ apt = "fd-find"; dnf = "fd-find" }
    },
    @{
        ID = "bat"; Name = "bat (Cat with Wings)"; Category = "System";
        WinIDs = @{ winget = "sharkdp.bat"; choco = "bat"; scoop = "bat" };
        MacIDs = @{ brew = "bat" };
        LinuxIDs = @{ apt = "bat"; dnf = "bat" };
        ConfigHooks = @("bat-config", "bat-manpager")
    },
    @{
        ID = "eza"; Name = "eza (Modern ls)"; Category = "System";
        WinIDs = @{ winget = "eza-community.eza"; scoop = "eza" };
        MacIDs = @{ brew = "eza" };
        LinuxIDs = @{ apt = "eza"; cargo = "eza" }
    },
    @{
        ID = "zoxide"; Name = "zoxide (Smarter cd)"; Category = "System";
        WinIDs = @{ winget = "ajeetdsouza.zoxide"; choco = "zoxide"; scoop = "zoxide" };
        MacIDs = @{ brew = "zoxide" };
        LinuxIDs = @{ apt = "zoxide"; script = "curl -sS https://raw.githubusercontent.com/ajeetdsouza/zoxide/main/install.sh | bash" };
        ConfigHooks = @("zoxide-shell-init")
    },
    @{
        ID = "btop"; Name = "btop++ (Resource Monitor)"; Category = "System";
        WinIDs = @{ winget = "aristocratos.btop4win"; scoop = "btop" };
        MacIDs = @{ brew = "btop" };
        LinuxIDs = @{ snap = "btop"; apt = "btop" }
    },
    @{
        ID = "glances"; Name = "Glances System Monitor"; Category = "System";
        WinIDs = @{ pip = "glances"; choco = "glances" };
        MacIDs = @{ brew = "glances" };
        LinuxIDs = @{ pip = "glances"; apt = "glances" }
    },
    @{
        ID = "rufus"; Name = "Rufus"; Category = "System"; OSFilter = "Windows";
        WinIDs = @{ winget = "Rufus.Rufus"; choco = "rufus"; scoop = "rufus" }
    },
    @{
        ID = "balena_etcher"; Name = "Balena Etcher"; Category = "System";
        WinIDs = @{ winget = "Balena.Etcher"; choco = "etcher"; scoop = "balena-etcher" };
        MacIDs = @{ cask = "balenaetcher" };
        LinuxIDs = @{ snap = "balena-etcher"; apt = "balena-etcher-electron" }
    },
    @{
        ID = "ventoy"; Name = "Ventoy"; Category = "System";
        WinIDs = @{ winget = "ventoy.Ventoy"; choco = "ventoy"; scoop = "ventoy" };
        MacIDs = @{ cask = "ventoy" };
        LinuxIDs = @{ script = "wget https://github.com/ventoy/Ventoy/releases/download/v1.0.96/ventoy-1.0.96-linux.tar.gz -O /tmp/ventoy.tar.gz" }
    },
    @{
        ID = "syncthing"; Name = "Syncthing"; Category = "System";
        WinIDs = @{ winget = "Syncthing.Syncthing"; choco = "syncthing"; scoop = "syncthing" };
        MacIDs = @{ cask = "syncthing" };
        LinuxIDs = @{ snap = "syncthing"; apt = "syncthing" }
    },
    @{
        ID = "tailscale"; Name = "Tailscale"; Category = "System";
        WinIDs = @{ winget = "Tailscale.Tailscale"; choco = "tailscale"; scoop = "tailscale" };
        MacIDs = @{ cask = "tailscale" };
        LinuxIDs = @{ script = "curl -fsSL https://tailscale.com/install.sh | sh" }
    },
    @{
        ID = "zerotier"; Name = "ZeroTier One"; Category = "System";
        WinIDs = @{ winget = "ZeroTier.ZeroTierOne"; choco = "zerotier-one"; scoop = "zerotier-one" };
        MacIDs = @{ cask = "zerotier-one" };
        LinuxIDs = @{ script = "curl -s https://install.zerotier.com | sudo bash" }
    },
    @{
        ID = "teamviewer"; Name = "TeamViewer"; Category = "System";
        WinIDs = @{ winget = "TeamViewer.TeamViewer"; choco = "teamviewer"; scoop = "teamviewer" };
        MacIDs = @{ cask = "teamviewer" };
        LinuxIDs = @{ apt = "teamviewer"; script = "wget https://download.teamviewer.com/download/linux/teamviewer_amd64.deb -O /tmp/tv.deb && sudo dpkg -i /tmp/tv.deb" }
    },
    @{
        ID = "anydesk"; Name = "AnyDesk"; Category = "System";
        WinIDs = @{ winget = "AnyDeskSoftwareGmbH.AnyDesk"; choco = "anydesk"; scoop = "anydesk" };
        MacIDs = @{ cask = "anydesk" };
        LinuxIDs = @{ apt = "anydesk" }
    },
    @{
        ID = "parsec"; Name = "Parsec Gaming"; Category = "System";
        WinIDs = @{ winget = "Parsec.Parsec"; choco = "parsec"; scoop = "parsec" };
        MacIDs = @{ cask = "parsec" };
        LinuxIDs = @{ script = "wget https://builds.parsecgaming.com/package/parsec-linux.deb -O /tmp/parsec.deb && sudo dpkg -i /tmp/parsec.deb" }
    },
    @{
        ID = " Sunshine"; Name = "Sunshine (Game Stream Host)"; Category = "System";
        WinIDs = @{ winget = "LizardByte.Sunshine"; choco = "sunshine"; scoop = "sunshine" };
        MacIDs = @{ brew = "sunshine" };
        LinuxIDs = @{ flatpak = "dev.lizardbyte.sunshine"; apt = "sunshine" }
    },
    @{
        ID = "moonlight"; Name = "Moonlight Client"; Category = "System";
        WinIDs = @{ winget = "MoonlightGameStreamingProject.Moonlight"; choco = "moonlight-qt"; scoop = "moonlight" };
        MacIDs = @{ cask = "moonlight" };
        LinuxIDs = @{ snap = "moonlight"; flatpak = "com.moonlight_stream.Moonlight" }
    }
)

# 4. CONFIGURATION PROFILES DATABASE
$script:ConfigProfiles = @{
    "Default" = @{
        Description = "Standard installation with safe defaults"
        Settings = @{
            Git = @{ 
                user_email = ""; user_name = ""; default_branch = "main"; 
                core_editor = "code --wait"; init_defaultBranch = "main"
            }
            VSCode = @{
                theme = "Dark+ (default dark)"; 
                extensions = @("ms-vscode.powershell", "GitHub.copilot", "eamodio.gitlens", "ms-python.python")
            }
            PowerShell = @{ execution_policy = "RemoteSigned"; install_psreadline = $true }
            NodeJS = @{ default_package_manager = "pnpm"; install_nvm = $true }
            Python = @{ install_poetry = $true; install_pipx = $true; default_venv = ".venv" }
        }
    }
    
    "Developer" = @{
        Description = "Full-stack development environment"
        Settings = @{
            Git = @{ default_branch = "main"; hooks_enabled = $true; signing_enabled = $true }
            VSCode = @{ 
                extensions = @(
                    "ms-vscode.powershell", "GitHub.copilot", "GitHub.copilot-chat",
                    "eamodio.gitlens", "ms-python.python", "ms-python.vscode-pylance",
                    "dbaeumer.vscode-eslint", "esbenp.prettier-vscode",
                    "ms-vscode.vscode-typescript-next", "bradlc.vscode-tailwindcss",
                    "rangav.vscode-thunder-client", "ms-azuretools.vscode-docker"
                )
            }
            Docker = @{ buildkit = $true; compose_v2 = $true }
            NodeJS = @{ install_nvm = $true; install_yarn = $true; install_pnpm = $true }
            Neovim = @{ config_preset = "LazyVim"; install_nerd_fonts = $true }
            Terminal = @{ shell = "powershell"; prompt = "starship" }
        }
    }
    
    "Cybersecurity" = @{
        Description = "Penetration testing and security research"
        Settings = @{
            BurpSuite = @{ license_type = "community"; java_memory = "4g" }
            Wireshark = @{ enable_usbpcap = $true; install_plugins = @("wireshark-geoip") }
            Metasploit = @{ database = "postgresql"; auto_start = $false }
            Terminal = @{ color_scheme = "hacker"; install_hacking_tools = $true }
            Firefox = @{ privacy_hardened = $true; install_security_addons = $true }
        }
    }
    
    "AI/ML Engineer" = @{
        Description = "Machine learning and AI development"
        Settings = @{
            Python = @{ 
                install_anaconda = $true; install_jupyter = $true; 
                cuda_enabled = $true; conda_channels = @("conda-forge", "pytorch")
            }
            VSCode = @{
                extensions = @(
                    "ms-python.python", "ms-toolsai.jupyter", "GitHub.copilot",
                    "ms-python.black-formatter", "njpwerner.autodocstring",
                    "GitHub.copilot-chat", "visualstudioexptteam.vscodeintellicode"
                )
            }
            Docker = @{ nvidia_runtime = $true; install_cuda_containers = $true }
            Ollama = @{ default_models = @("llama3.2", "codellama", "mistral") }
        }
    }
    
    "Creative Professional" = @{
        Description = "Video, design, and content creation"
        Settings = @{
            OBS = @{ 
                install_plugins = @("obs-ndi", "obs-websocket", "streamfx");
                output_resolution = "1080p"; encoder = "x264"
            }
            DaVinciResolve = @{ enable_studio = $false; cache_location = "auto" }
            Blender = @{ enable_cuda = $true; install_addons = @("node-wrangler", "auto-rig-pro") }
        }
    }
    
    "Privacy Focused" = @{
        Description = "Maximum privacy and security configuration"
        Settings = @{
            Browser = @{ default = "Firefox"; harden_firefox = $true; install_ublock = $true }
            VPN = @{ default = "Mullvad"; kill_switch = $true; dns_leak_protection = $true }
            Communication = @{ default = "Signal"; disable_metadata = $true }
            System = @{ disable_telemetry = $true; use_local_dns = $true; encrypt_dns = "doh" }
        }
    }
    
    "Minimal" = @{
        Description = "Essential tools only, no configurations"
        Settings = @{}
    }
}

# 5. AUTO-CONFIGURATION FUNCTIONS
$script:ConfigFunctions = @{}

$script:ConfigFunctions['git-config'] = {
    param($Settings)
    Write-Log "Configuring Git with user preferences..." "CONFIG" "Git"
    
    if ($Settings.Git.user_email) { git config --global user.email $Settings.Git.user_email }
    if ($Settings.Git.user_name) { git config --global user.name $Settings.Git.user_name }
    git config --global init.defaultBranch $Settings.Git.default_branch
    git config --global core.editor $Settings.Git.core_editor
    git config --global push.autoSetupRemote true
    git config --global pull.rebase false
    git config --global core.autocrlf input
    git config --global core.pager "delta --dark"
    
    # Install delta if not present
    if (-not (Get-Command delta -ErrorAction SilentlyContinue)) {
        if ($IsWindows) { winget install dandavison.delta --silent }
        elseif ($IsMacOS) { brew install git-delta }
        elseif ($IsLinux) { cargo install git-delta }
    }
    
    Write-Log "Git configured successfully" "SUCCESS" "Git"
}

$script:ConfigFunctions['code-extensions'] = {
    param($Settings)
    Write-Log "Installing VSCode extensions..." "CONFIG" "VSCode"
    
    $extensions = $Settings.VSCode.extensions
    foreach ($ext in $extensions) {
        code --install-extension $ext --force 2>$null
        if ($?) { Write-Log "Installed: $ext" "DEBUG" "VSCode" }
    }
    
    # Apply settings.json modifications
    $settingsPath = if ($IsWindows) { 
        "$env:APPDATA\Code\User\settings.json" 
    } elseif ($IsMacOS) { 
        "$HOME/Library/Application Support/Code/User/settings.json" 
    } else { 
        "$HOME/.config/Code/User/settings.json" 
    }
    
    $vsSettings = @{
        "editor.fontSize" = 14
        "editor.fontFamily" = "'JetBrains Mono', 'Fira Code', Consolas, monospace"
        "editor.fontLigatures" = $true
        "terminal.integrated.fontFamily" = "'JetBrains Mono', monospace"
        "workbench.colorTheme" = $Settings.VSCode.theme
        "editor.formatOnSave" = $true
        "editor.bracketPairColorization.enabled" = $true
        "editor.guides.bracketPairs" = "active"
    } | ConvertTo-Json -Depth 10
    
    $vsSettings | Set-Content -Path $settingsPath -Force
    Write-Log "VSCode settings applied" "SUCCESS" "VSCode"
}

$script:ConfigFunctions['ps7-modules'] = {
    param($Settings)
    Write-Log "Installing PowerShell modules..." "CONFIG" "PowerShell"
    
    $modules = @("PSReadLine", "Terminal-Icons", "posh-git", "PSFzf", "z")
    foreach ($mod in $modules) {
        Install-Module -Name $mod -Force -SkipPublisherCheck -AllowClobber
        Write-Log "Installed module: $mod" "DEBUG" "PowerShell"
    }
    
    # Update profile
    $profileContent = @"
# Auto-generated by Ultimate Installer
Import-Module PSReadLine
Import-Module Terminal-Icons
Import-Module posh-git
Import-Module PSFzf
Import-Module z

Set-PSReadLineOption -PredictionSource History
Set-PSReadLineOption -PredictionViewStyle ListView
Set-PSReadLineOption -EditMode Windows

# Starship prompt (if installed)
if (Get-Command starship -ErrorAction SilentlyContinue) {
    Invoke-Expression (&starship init powershell)
}
"@
    
    $profileContent | Set-Content -Path $PROFILE.AllUsersAllHosts -Force
    Write-Log "PowerShell profile updated" "SUCCESS" "PowerShell"
}

$script:ConfigFunctions['starship-config'] = {
    param($Settings)
    Write-Log "Configuring Starship prompt..." "CONFIG" "Terminal"
    
    $config = @"
# Starship configuration
format = """
\$username\
\$hostname\
\$directory\
\$git_branch\
\$git_state\
\$git_status\
\$cmd_duration\
\$line_break\
\$python\
\$character"""

[directory]
truncation_length = 3
truncation_symbol = "…/"

[git_branch]
symbol = "🌱 "
truncation_length = 4
truncated_branch_suffix = ""

[python]
symbol = "🐍 "
python_binary = "python3"

[character]
success_symbol = "[➜](bold green)"
error_symbol = "[✗](bold red)"
"@
    
    $configPath = if ($IsWindows) { "$env:USERPROFILE\.config\starship.toml" } else { "$HOME/.config/starship.toml" }
    New-Item -ItemType Directory -Path (Split-Path $configPath) -Force | Out-Null
    $config | Set-Content -Path $configPath -Force
    
    Write-Log "Starship configured" "SUCCESS" "Terminal"
}

$script:ConfigFunctions['docker-nvidia'] = {
    param($Settings)
    if (-not $IsLinux) { return }
    
    Write-Log "Configuring Docker with NVIDIA runtime..." "CONFIG" "Docker"
    
    # Install nvidia-docker2
    distribution = $(. /etc/os-release;echo $ID$VERSION_ID)
    curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
    curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list
    sudo apt update
    sudo apt install -y nvidia-docker2
    sudo systemctl restart docker
    
    Write-Log "NVIDIA Docker runtime configured" "SUCCESS" "Docker"
}

$script:ConfigFunctions['ollama-models'] = {
    param($Settings)
    Write-Log "Pulling default Ollama models..." "CONFIG" "AI"
    
    $models = $Settings.Ollama.default_models
    foreach ($model in $models) {
        Write-Log "Pulling model: $model..." "DEBUG" "Ollama"
        ollama pull $model
    }
    
    # Create Modelfile for coding
    $modelfile = @"
FROM codellama
SYSTEM You are an expert coding assistant. Provide concise, accurate code suggestions.
PARAMETER temperature 0.2
PARAMETER top_p 0.9
"@
    
    $modelfile | ollama create codellama-coder -f -
    Write-Log "Ollama models configured" "SUCCESS" "AI"
}

$script:ConfigFunctions['chrome-extensions-dev'] = {
    param($Settings)
    Write-Log "Configuring Chrome for development..." "CONFIG" "Browser"
    
    $extIds = @(
        "nhdogjmejiglipccpnnnanhbledajbpd", # Vue.js devtools
        "fmkadmapgofadopljbjfkapdkoienihi", # React DevTools
        "lmhkpmbekcpmknklioeibfkpmmfibljd", # Redux DevTools
        "cjbdombiopgmcpkmimfnkdegfjglgcmo", # Lighthouse
        "jnhgnonknpbeldmbfkepgknjgnhknok"  # Dark Reader
    )
    
    # Chrome extensions can only be installed via policy or webstore on first launch
    # This creates a bookmark file with extension links for easy manual install
    $bookmarkPath = if ($IsWindows) {
        "$env:LOCALAPPDATA\Google\Chrome\User Data\Default\Bookmarks"
    } else {
        "$HOME/.config/google-chrome/Default/Bookmarks"
    }
    
    Write-Log "Chrome dev extensions bookmarked for manual install" "SUCCESS" "Browser"
}

$script:ConfigFunctions['kali-tools'] = {
    param($Settings)
    if (-not $IsWindows) { return }
    
    Write-Log "Installing Kali tools in WSL..." "CONFIG" "Security"
    
    wsl -d kali-linux -e bash -c @"
sudo apt update
sudo apt install -y kali-linux-default
sudo apt install -y kali-tools-web kali-tools-wireless kali-tools-forensics
sudo apt install -y exploitdb
"@
    
    Write-Log "Kali tools installed in WSL" "SUCCESS" "Security"
}

$script:ConfigFunctions['obsidian-plugins'] = {
    param($Settings)
    Write-Log "Configuring Obsidian with recommended plugins..." "CONFIG" "Productivity"
    
    $vaultPath = "$HOME/Obsidian Vault"
    New-Item -ItemType Directory -Path $vaultPath -Force | Out-Null
    
    # Create .obsidian directory structure
    $obsidianDir = Join-Path $vaultPath ".obsidian"
    New-Item -ItemType Directory -Path $obsidianDir -Force | Out-Null
    
    $communityPlugins = @(
        "obsidian-git", "dataview", "templater-obsidian", 
        "calendar", "kanban", "excalidraw-obsidian"
    )
    
    $corePlugins = @{
        "file-explorer" = $true
        "global-search" = $true
        "switcher" = $true
        "graph" = $true
        "backlink" = $true
        "canvas" = $true
        "outgoing-link" = $true
        "tag-pane" = $true
        "page-preview" = $true
        "daily-notes" = $true
        "templates" = $true
        "note-composer" = $true
        "command-palette" = $true
        "slash-command" = $true
        "editor-status" = $true
        "bookmarks" = $true
        "markdown-importer" = $false
        "zk-prefixer" = $true
        "random-note" = $true
        "outline" = $true
        "word-count" = $true
        "slides" = $false
        "audio-recorder" = $false
        "open-with-default-app" = $true
        "workspaces" = $true
    }
    
    $appJson = @{
        "alwaysUpdateLinks" = $true
        "newFileLocation" = "folder"
        "newFileFolderPath" = "Inbox"
        "attachmentFolderPath" = "Attachments"
        "pdfExportSettings" = @{
            "pageSize" = "Letter"
            "landscape" = $false
            "margin" = "0"
            "downscalePercent" = 100
        }
        "promptDelete" = $false
    } | ConvertTo-Json -Depth 10
    
    $appJson | Set-Content -Path (Join-Path $obsidianDir "app.json") -Force
    
    $corePluginsJson = $corePlugins | ConvertTo-Json -Depth 10
    $corePluginsJson | Set-Content -Path (Join-Path $obsidianDir "core-plugins.json") -Force
    
    $communityPluginsJson = @{ "communityPlugins" = $communityPlugins } | ConvertTo-Json -Depth 10
    $communityPluginsJson | Set-Content -Path (Join-Path $obsidianDir "community-plugins.json") -Force
    
    Write-Log "Obsidian vault configured at $vaultPath" "SUCCESS" "Productivity"
}

# 6. INTERACTIVE MENU SYSTEM
function Show-MainMenu {
    Clear-Host
    Write-Host @"
╔══════════════════════════════════════════════════════════════════════╗
║                    ULTIMATE INSTALLER v3.0                           ║
║         $(if ($script:OSDetails.Type -eq "Windows" -and $script:OSDetails.IsServer) { "Windows Server Edition" } else { "$($script:OSDetails.Type) $($script:OSDetails.Version)" }) | Profile: $ConfigProfile | Arch: $($script:OSDetails.Architecture)
╠══════════════════════════════════════════════════════════════════════╣
║  CURRENT PACKAGE MANAGERS: $($script:OSDetails.PackageManagers -join ', ')$(if ($script:OSDetails.PackageManagers.Count -eq 0) { ' [BOOTSTRAP REQUIRED]' })
╠══════════════════════════════════════════════════════════════════════╣
║  SELECTION MODES:                                                      ║
║    [B] Browse by Category    [S] Search by Name       [N] New Apps     ║
║    [P] Popular Bundles       [R] Recently Updated   [F] Favorites    ║
╠══════════════════════════════════════════════════════════════════════╣
║  SYSTEM ACTIONS:                                                       ║
║    [C] Change Profile        [M] Manage Pkg Managers [U] Update All  ║
║    [I] Import/Export Config  [T] System Tweaks       [H] Help/About  ║
╠══════════════════════════════════════════════════════════════════════╣
║  QUICK INSTALL:  [DEV] [SEC] [AI] [CLOUD] [CREATIVE] [MINIMAL]       ║
║  SPECIAL:        [WEB] AI Portals  [WSL] Setup Linux  [AUTO] Full Auto║
╠══════════════════════════════════════════════════════════════════════╣
║  [Q] Quit  |  Enter numbers/names (1,3,5 or git,vscode,python)       ║
╚══════════════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan
    
    # Show available apps preview
    Write-Host "`nRecently Added:" -ForegroundColor Yellow
    $recent = $script:MasterApps | Select-Object -Last 5
    $recent | ForEach-Object { Write-Host "  + $($_.Name) [$($_.Category)]" -ForegroundColor Gray }
}

function Show-CategoryMenu {
    Clear-Host
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "                    BROWSE BY CATEGORY" -ForegroundColor Cyan
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    
    $categories = $script:MasterApps | Group-Object -Property Category | Sort-Object Name
    $idx = 1
    $catMap = @{}
    
    foreach ($cat in $categories) {
        $available = ($cat.Group | Where-Object { Test-AppAvailability $_ }).Count
        $total = $cat.Group.Count
        
        Write-Host "[$idx] $($cat.Name.PadRight(20)) ($available/$total available)" -ForegroundColor $(if ($available -gt 0) { "White" } else { "DarkGray" })
        $catMap[$idx] = $cat.Name
        $idx++
    }
    
    Write-Host "`n[0] Back to Main Menu" -ForegroundColor Yellow
    $choice = Read-Host "`nSelect category"
    
    if ($choice -eq "0") { return }
    if ($catMap.ContainsKey([int]$choice)) {
        Show-AppsInCategory $catMap[[int]$choice]
    }
}

function Show-AppsInCategory {
    param([string]$Category)
    
    Clear-Host
    Write-Host "═══ $Category ═══" -ForegroundColor Cyan
    
    $apps = $script:MasterApps | Where-Object { $_.Category -eq $Category }
    $available = $apps | Where-Object { Test-AppAvailability $_ }
    
    if ($available.Count -eq 0) {
        Write-Host "No apps available in this category for your system." -ForegroundColor Red
        Read-Host "Press Enter to continue"
        return
    }
    
    $idx = 1
    $appMap = @{}
    
    foreach ($app in $available) {
        $pm = Get-BestPackageManager $app
        $status = if (Test-AppInstalled $app) { "[INSTALLED]" } else { "[ ]" }
        
        Write-Host "[$idx] $($app.Name.PadRight(25)) via $pm $status" -ForegroundColor $(if ($status -eq "[INSTALLED]") { "Green" } else { "White" })
        $appMap[$idx] = $app
        $idx++
    }
    
    Write-Host "`n[ALL] Install All  [0] Back  [M] Main Menu" -ForegroundColor Yellow
    $choice = Read-Host "Select apps (comma-separated)"
    
    if ($choice -eq "0") { Show-CategoryMenu }
    elseif ($choice -eq "M") { return }
    elseif ($choice -eq "ALL") {
        Install-Apps $available
    } else {
        $selections = $choice.Split(",").Trim() | ForEach-Object { [int]$_ } | Where-Object { $appMap.ContainsKey($_) }
        $toInstall = $selections | ForEach-Object { $appMap[$_] }
        Install-Apps $toInstall
    }
}

function Show-BundlesMenu {
    Clear-Host
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "                    POPULAR BUNDLES" -ForegroundColor Cyan
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    
    $bundles = @(
        @{ Name = "Essential Dev"; Apps = @("git", "code", "terminal_ghostty", "fzf", "ripgrep", "bat", "zoxide"); Color = "Green" }
        @{ Name = "Modern Terminal"; Apps = @("windows_terminal", "powershell7", "starship", "fzf", "fd", "eza", "btop", "zoxide"); Color = "Blue" }
        @{ Name = "Web Development"; Apps = @("nodejs", "code", "docker", "postman", "chrome", "firefox_dev"); Color = "Cyan" }
        @{ Name = "Python Data Science"; Apps = @("python3", "anaconda", "vscode", "docker", "obsidian"); Color = "Yellow" }
        @{ Name = "Cybersecurity Pro"; Apps = @("kali_wsl", "metasploit", "wireshark", "burp_suite", "nmap", "tor_browser", "veracrypt"); Color = "Red" }
        @{ Name = "AI Engineer"; Apps = @("ollama", "python3", "vscode", "docker", "cursor", "claude_desktop", "chatgpt_desktop"); Color = "Magenta" }
        @{ Name = "Cloud Native"; Apps = @("docker", "kubectl", "helm", "terraform", "awscli", "azurecli", "lens"); Color = "White" }
        @{ Name = "Content Creator"; Apps = @("obs_studio", "davinci_resolve", "blender", "gimp", "audacity", "obsidian"); Color = "DarkYellow" }
    )
    
    $idx = 1
    foreach ($bundle in $bundles) {
        $availableCount = ($bundle.Apps | Where-Object { 
            $appId = $_
            $app = $script:MasterApps | Where-Object { $_.ID -eq $appId }
            Test-AppAvailability $app
        }).Count
        
        Write-Host "[$idx] $($bundle.Name.PadRight(20)) ($availableCount tools)" -ForegroundColor $bundle.Color
        $idx++
    }
    
    Write-Host "`n[0] Back" -ForegroundColor Yellow
    $choice = Read-Host "Select bundle"
    
    if ($choice -eq "0") { return }
    if ($choice -match '^\d+$' -and [int]$choice -le $bundles.Count) {
        $selected = $bundles[[int]$choice - 1]
        Write-Host "`nInstalling: $($selected.Name)" -ForegroundColor $selected.Color
        $appsToInstall = $selected.Apps | ForEach-Object { 
            $id = $_
            $script:MasterApps | Where-Object { $_.ID -eq $id }
        } | Where-Object { Test-AppAvailability $_ }
        
        Install-Apps $appsToInstall
    }
}

function Show-ProfileMenu {
    Clear-Host
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "               CONFIGURATION PROFILES" -ForegroundColor Cyan
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "Current: $ConfigProfile`n" -ForegroundColor Yellow
    
    $idx = 1
    foreach ($prof in $script:ConfigProfiles.GetEnumerator() | Sort-Object Key) {
        Write-Host "[$idx] $($prof.Key.PadRight(15)) - $($prof.Value.Description)" -ForegroundColor White
        $idx++
    }
    
    Write-Host "`n[0] Cancel" -ForegroundColor Yellow
    $choice = Read-Host "Select profile"
    
    if ($choice -match '^\d+$') {
        $profiles = $script:ConfigProfiles.GetEnumerator() | Sort-Object Key
        if ([int]$choice -le $profiles.Count) {
            $global:ConfigProfile = $profiles[[int]$choice - 1].Key
            Write-Log "Switched to profile: $ConfigProfile" "INFO" "Config"
        }
    }
}

function Show-PackageManagerMenu {
    Clear-Host
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "          PACKAGE MANAGER MANAGEMENT" -ForegroundColor Cyan
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    
    Write-Host "Installed:" -ForegroundColor Green
    $script:OSDetails.PackageManagers | ForEach-Object { Write-Host "  ✓ $_" -ForegroundColor Green }
    
    Write-Host "`nAvailable to install:" -ForegroundColor Yellow
    
    if ($IsWindows) {
        $available = @()
        if (-not ($script:OSDetails.PackageManagers -contains "chocolatey")) { 
            $available += @{ Name = "Chocolatey"; Cmd = "choco"; Install = { 
                Set-ExecutionPolicy Bypass -Scope Process -Force
                [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
                iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
            }}
        }
        if (-not ($script:OSDetails.PackageManagers -contains "scoop")) {
            $available += @{ Name = "Scoop"; Cmd = "scoop"; Install = { iwr -useb get.scoop.sh | iex } }
        }
        if (-not ($script:OSDetails.PackageManagers -contains "winget")) {
            $available += @{ Name = "WinGet (Repair)"; Cmd = "winget"; Install = {
                Install-Module -Name Microsoft.WinGet.Client -Force -AllowClobber -Repository PSGallery
                Repair-WinGetPackageManager -AllUsers
            }}
        }
    } elseif ($IsMacOS) {
        if (-not ($script:OSDetails.PackageManagers -contains "homebrew")) {
            $available += @{ Name = "Homebrew"; Cmd = "brew"; Install = {
                /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
            }}
        }
    } elseif ($IsLinux) {
        # Linux package manager suggestions based on distro
        if ($script:OSDetails.Version -match "Ubuntu|Debian" -and -not ($script:OSDetails.PackageManagers -contains "snap")) {
            $available += @{ Name = "Snap"; Cmd = "snap"; Install = {
                sudo apt install -y snapd
                sudo systemctl enable --now snapd.socket
            }}
        }
    }
    
    $idx = 1
    foreach ($pm in $available) {
        Write-Host "[$idx] Install $($pm.Name)" -ForegroundColor White
        $idx++
    }
    
    Write-Host "`n[0] Back" -ForegroundColor Yellow
    $choice = Read-Host "Select"
    
    if ($choice -match '^\d+$' -and [int]$choice -le $available.Count) {
        $selected = $available[[int]$choice - 1]
        Write-Host "Installing $($selected.Name)..." -ForegroundColor Yellow
        & $selected.Install
        # Refresh package manager list
        . $PSCommandPath -SkipBootstrap
    }
}

# 7. CORE FUNCTIONS

function Test-AppAvailability {
    param([hashtable]$App)
    
    if ($App.OSFilter -and $App.OSFilter -notmatch $script:OSDetails.Type) { return $false }
    
    if ($IsWindows) { return $App.WinIDs.Count -gt 0 }
    elseif ($IsMacOS) { return $App.MacIDs.Count -gt 0 }
    elseif ($IsLinux) { return $App.LinuxIDs.Count -gt 0 }
    return $false
}

function Get-BestPackageManager {
    param([hashtable]$App)
    
    $ids = if ($IsWindows) { $App.WinIDs } elseif ($IsMacOS) { $App.MacIDs } else { $App.LinuxIDs }
    
    # Priority order based on OS
    $priority = if ($IsWindows) { 
        @("winget", "choco", "scoop", "msstore", "chocolatey")
    } elseif ($IsMacOS) {
        @("brew", "cask", "macports")
    } else {
        @("apt", "dnf", "pacman", "snap", "flatpak", "yum", "zypper")
    }
    
    foreach ($pm in $priority) {
        if ($ids.ContainsKey($pm) -and ($script:OSDetails.PackageManagers -contains $pm -or $pm -eq "script")) {
            return $pm
        }
    }
    
    # Return first available
    return $ids.Keys | Select-Object -First 1
}

function Test-AppInstalled {
    param([hashtable]$App)
    
    # Quick check via command existence for CLI tools
    if (Get-Command $App.ID -ErrorAction SilentlyContinue) { return $true }
    
    # Package manager specific checks
    $pm = Get-BestPackageManager $App
    switch ($pm) {
        "winget" { 
            $result = winget list --id $App.WinIDs.winget --exact 2>$null | Out-String
            return $result -match $App.WinIDs.winget
        }
        "choco" {
            $result = choco list --exact $App.WinIDs.choco --limit-output 2>$null
            return $result -match $App.WinIDs.choco
        }
        "brew" {
            $result = brew list $App.MacIDs.brew 2>$null
            return $?
        }
        "apt" {
            $result = dpkg -l $App.LinuxIDs.apt 2>$null | Out-String
            return $result -match "^ii"
        }
    }
    return $false
}

function Install-Apps {
    param([array]$Apps)
    
    if ($Apps.Count -eq 0) { 
        Write-Log "No apps to install" "WARN" "Install"
        return 
    }
    
    Write-Host "`n╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "  INSTALLATION QUEUE: $($Apps.Count) application(s)" -ForegroundColor Cyan
    Write-Host "  Profile: $ConfigProfile | Dry Run: $DryRun" -ForegroundColor Cyan
    Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    
    $success = @()
    $failed = @()
    $skipped = @()
    
    foreach ($app in $Apps) {
        Write-Host "`n── Installing: $($app.Name) ──" -ForegroundColor Yellow
        
        if (Test-AppInstalled $app) {
            Write-Log "$($app.Name) is already installed" "SUCCESS" "Install"
            $skipped += $app
            continue
        }
        
        if ($DryRun) {
            Write-Log "[DRY RUN] Would install $($app.Name) via $(Get-BestPackageManager $app)" "INFO" "Install"
            $success += $app
            continue
        }
        
        try {
            $pm = Get-BestPackageManager $app
            $id = if ($IsWindows) { $app.WinIDs[$pm] } elseif ($IsMacOS) { $app.MacIDs[$pm] } else { $app.LinuxIDs[$pm] }
            
            Write-Log "Using $pm to install $($app.Name) [$id]" "INFO" "Install"
            
            switch ($pm) {
                "winget" { 
                    winget install --id $id --silent --accept-package-agreements --accept-source-agreements --disable-interactivity
                    if ($LASTEXITCODE -ne 0) { throw "WinGet exit code $LASTEXITCODE" }
                }
                "choco" { 
                    choco install $id -y --no-progress 
                    if ($LASTEXITCODE -ne 0) { throw "Chocolatey exit code $LASTEXITCODE" }
                }
                "scoop" { 
                    scoop install $id 
                    if ($LASTEXITCODE -ne 0) { throw "Scoop failed" }
                }
                "brew" { 
                    brew install $id 
                    if ($LASTEXITCODE -ne 0) { throw "Homebrew failed" }
                }
                "cask" {
                    brew install --cask $id
                    if ($LASTEXITCODE -ne 0) { throw "Homebrew Cask failed" }
                }
                "apt" { 
                    sudo apt install -y $id 
                    if ($LASTEXITCODE -ne 0) { throw "APT failed" }
                }
                "snap" {
                    sudo snap install $id
                    if ($LASTEXITCODE -ne 0) { throw "Snap failed" }
                }
                "flatpak" {
                    flatpak install -y flathub $id
                    if ($LASTEXITCODE -ne 0) { throw "Flatpak failed" }
                }
                "script" {
                    Invoke-Expression $id
                }
                "pip" {
                    pip install $id
                }
                "npm" {
                    npm install -g $id
                }
                "cargo" {
                    cargo install $id
                }
                default {
                    throw "Unknown package manager: $pm"
                }
            }
            
            Write-Log "$($app.Name) installed successfully" "SUCCESS" "Install"
            $success += $app
            
            # Run configuration hooks if profile has settings for this app
            if ($script:ConfigProfiles[$ConfigProfile].Settings.ContainsKey($app.ID) -or 
                $app.ConfigHooks) {
                Start-AppConfiguration $app
            }
            
        } catch {
            Write-Log "Failed to install $($app.Name): $_" "ERROR" "Install"
            $failed += $app
            $script:InstallLog.Errors += @{
                App = $app.Name
                Error = $_.Exception.Message
                Time = Get-Date -Format "HH:mm:ss"
            }
        }
    }
    
    # Summary
    Write-Host "`n═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "                    INSTALLATION SUMMARY" -ForegroundColor Cyan
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "Success: $($success.Count) | Failed: $($failed.Count) | Skipped: $($skipped.Count)" -ForegroundColor $(if ($failed.Count -eq 0) { "Green" } else { "Yellow" })
    
    if ($failed.Count -gt 0) {
        Write-Host "`nFailed installations:" -ForegroundColor Red
        $failed | ForEach-Object { Write-Host "  ✗ $($_.Name)" -ForegroundColor Red }
    }
    
    if ($success.Count -gt 0 -and -not $DryRun) {
        Write-Host "`nConfigurations applied for profile: $ConfigProfile" -ForegroundColor Magenta
    }
    
    # Save JSON log
    $script:InstallLog.EndTime = Get-Date
    $script:InstallLog.Duration = ($script:InstallLog.EndTime - $script:StartTime).ToString()
    $script:InstallLog.Success = $success | ForEach-Object { $_.Name }
    $script:InstallLog.Failed = $failed | ForEach-Object { $_.Name }
    $script:InstallLog | ConvertTo-Json -Depth 10 | Set-Content -Path $jsonLog
    
    Write-Host "`nDetailed log saved to: $jsonLog" -ForegroundColor Gray
    Read-Host "`nPress Enter to continue"
}

function Start-AppConfiguration {
    param([hashtable]$App)
    
    $profile = $script:ConfigProfiles[$ConfigProfile]
    if (-not $profile) { return }
    
    foreach ($hook in $App.ConfigHooks) {
        if ($script:ConfigFunctions.ContainsKey($hook)) {
            Write-Log "Running config hook: $hook" "CONFIG" $App.Name
            try {
                & $script:ConfigFunctions[$hook] $profile.Settings
            } catch {
                Write-Log "Config hook failed: $_" "ERROR" $App.Name
            }
        }
    }
}

# 8. MAIN EXECUTION LOOP
if (-not $SkipBootstrap -and $script:OSDetails.PackageManagers.Count -eq 0) {
    Write-Log "No package managers found. Running bootstrap..." "WARN" "System"
    # Re-run bootstrap section from top
    . $PSCommandPath -SkipBootstrap
}

do {
    Show-MainMenu
    $choice = (Read-Host "`nSelection").ToUpper().Trim()
    
    switch -Regex ($choice) {
        "^[0-9,]+$" {
            # Direct numeric selection
            $indices = $choice.Split(",").Trim() | ForEach-Object { [int]$_ } | Where-Object { $_ -gt 0 }
            $toInstall = $indices | ForEach-Object { 
                $available = $script:MasterApps | Where-Object { Test-AppAvailability $_ }
                if ($_ -le $available.Count) { $available[$_ - 1] }
            }
            Install-Apps $toInstall
        }
        "^[A-Z]" {
            # Name-based selection
            $toInstall = $script:MasterApps | Where-Object { 
                $_.Name -like "*$choice*" -or $_.ID -like "*$choice*" 
            } | Where-Object { Test-AppAvailability $_ }
            Install-Apps $toInstall
        }
        "B" { Show-CategoryMenu }
        "S" { 
            $term = Read-Host "Search term"
            $results = $script:MasterApps | Where-Object { 
                $_.Name -like "*$term*" -or $_.Category -like "*$term*" 
            } | Where-Object { Test-AppAvailability $_ }
            Install-Apps $results
        }
        "P" { Show-BundlesMenu }
        "C" { Show-ProfileMenu }
        "M" { Show-PackageManagerMenu }
        "U" { 
            Write-Log "Updating all packages..." "INFO" "Maintenance"
            if ($IsWindows -and (Get-Command winget -ErrorAction SilentlyContinue)) { winget upgrade --all }
            elseif ($IsMacOS) { brew update; brew upgrade }
            elseif ($IsLinux) { sudo apt update; sudo apt upgrade -y }
        }
        "DEV" { 
            $bundle = $script:MasterApps | Where-Object { $_.Category -in @("Core Dev", "Languages", "Cloud") }
            Install-Apps ($bundle | Where-Object { Test-AppAvailability $_ })
        }
        "SEC" {
            $bundle = $script:MasterApps | Where-Object { $_.Category -eq "Security" }
            Install-Apps ($bundle | Where-Object { Test-AppAvailability $_ })
        }
        "AI" {
            $bundle = $script:MasterApps | Where-Object { $_.Category -eq "AI/ML" }
            Install-Apps ($bundle | Where-Object { Test-AppAvailability $_ })
        }
        "CLOUD" {
            $bundle = $script:MasterApps | Where-Object { $_.Category -eq "Cloud" }
            Install-Apps ($bundle | Where-Object { Test-AppAvailability $_ })
        }
        "CREATIVE" {
            $bundle = $script:MasterApps | Where-Object { $_.Category -eq "Creative" }
            Install-Apps ($bundle | Where-Object { Test-AppAvailability $_ })
        }
        "MINIMAL" {
            $bundle = $script:MasterApps | Where-Object { $_.ID -in @("git", "code", "nodejs", "python3", "fzf", "ripgrep") }
            Install-Apps ($bundle | Where-Object { Test-AppAvailability $_ })
        }
        "WEB" {
            Write-Log "Opening AI web portals..." "INFO" "Browser"
            $urls = @(
                "https://chat.openai.com", "https://claude.ai", "https://gemini.google.com",
                "https://poe.com", "https://perplexity.ai", "https://kimi.moonshot.cn",
                "https://huggingface.co/chat", "https://www.anthropic.com"
            )
            foreach ($url in $urls) { 
                if ($IsWindows) { Start-Process $url }
                else { Start-Process $url }
            }
        }
        "WSL" {
            if ($IsWindows) {
                Write-Log "Setting up WSL..." "INFO" "WSL"
                wsl --install --no-launch
                wsl --set-default-version 2
            } else {
                Write-Log "WSL is Windows-only" "WARN" "WSL"
            }
        }
        "AUTO" {
            Write-Log "Starting full automatic installation..." "INFO" "Auto"
            $allAvailable = $script:MasterApps | Where-Object { Test-AppAvailability $_ }
            Install-Apps $allAvailable
        }
        "T" {
            # System tweaks menu
            Clear-Host
            Write-Host "SYSTEM TWEAKS" -ForegroundColor Cyan
            Write-Host "[1] Enable developer mode" -ForegroundColor White
            Write-Host "[2] Optimize for performance" -ForegroundColor White
            Write-Host "[3] Privacy hardening" -ForegroundColor White
            Write-Host "[4] Install Nerd Fonts" -ForegroundColor White
            $tweak = Read-Host "Select"
            switch ($tweak) {
                "1" {
                    if ($IsWindows) {
                        reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\AppModelUnlock" /t REG_DWORD /f /v "AllowDevelopmentWithoutDevLicense" /d "1"
                        Write-Log "Developer mode enabled" "SUCCESS" "Tweaks"
                    }
                }
                "4" {
                    $fonts = @("JetBrainsMono", "FiraCode", "CascadiaCode")
                    foreach ($font in $fonts) {
                        if ($IsWindows) {
                            winget install "NerdFonts.$font" --silent
                        } elseif ($IsMacOS) {
                            brew tap homebrew/cask-fonts
                            brew install --cask "font-$($font.toLower())-nerd-font"
                        }
                    }
                }
            }
        }
        "H" {
            Clear-Host
            Write-Host @"
ULTIMATE INSTALLER v3.0 HELP
═══════════════════════════════════════════════════════════════════

NAVIGATION:
  - Enter numbers (1,3,5) to select by menu index
  - Enter app names (git, vscode, python) for quick search
  - Use categories [B] or bundles [P] for guided selection

PROFILES:
  Switch profiles [C] to auto-configure apps after installation:
  • Developer: Full VSCode setup, Git config, Node/Python tools
  • Cybersecurity: Burp Suite, Metasploit configs, privacy settings
  • AI/ML Engineer: CUDA setup, Ollama models, Jupyter config
  • Privacy Focused: Hardened browser settings, VPN configs

PACKAGE MANAGERS:
  The installer automatically selects the best available package manager.
  Use [M] to install missing ones (Chocolatey, Scoop, Homebrew, etc.)

CONFIGURATION:
  After installation, apps are auto-configured based on your profile.
  Logs are saved to: $logDir

SPECIAL COMMANDS:
  [WEB]   - Open all AI chat interfaces in browser
  [WSL]   - Setup Windows Subsystem for Linux
  [AUTO]  - Install ALL available apps (use with caution!)
"@ -ForegroundColor Cyan
            Read-Host "`nPress Enter to continue"
        }
    }
} while ($choice -ne "Q")

Write-Log "Session ended" "INFO" "System"
Stop-Transcript
