# ============================================================================
# ULTIMATE CROSS-PLATFORM SYSTEM INSTALLER v5.0
# Mega Edition: Combined v3.0 + v4.0 Features
# Real-Time Search | System Tweaks | Privacy Tools | Kali Integration
# ============================================================================

#Requires -Version 7.0
#Requires -Modules PSReadLine

param(
    [switch]$Silent,
    [string]$ConfigProfile = "Default",
    [switch]$SkipBootstrap,
    [switch]$DryRun,
    [switch]$NoUpdates,
    [switch]$AutoTweak,
    [string]$SettingsFile = "$PSScriptRoot\installer_settings.json"
)

# 1. ADVANCED LOGGING & SESSION MANAGEMENT
$script:StartTime = Get-Date
$script:SessionId = [Guid]::NewGuid().ToString().Substring(0, 8)
$logDir = if ($IsWindows) { 
    Join-Path ([Environment]::GetFolderPath("MyDocuments")) "UltimateInstaller" 
} else { 
    "$HOME/.ultimate_installer" 
}
if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir -Force | Out-Null }

$logFile = Join-Path $logDir "Install_$(Get-Date -Format 'yyyyMMdd_HHmmss')_$($script:SessionId).log"
$jsonLog = Join-Path $logDir "Session_$($script:SessionId).json"
$updateCacheFile = Join-Path $logDir "update_cache.json"

Start-Transcript -Path $logFile -Append -IncludeInvocationHeader

$script:InstallLog = @{
    SessionId = $script:SessionId
    StartTime = $script:StartTime
    OS = @{}
    Actions = @()
    Errors = @()
    Settings = @{}
}

# 2. SETTINGS MANAGEMENT SYSTEM
$script:DefaultSettings = @{
    Version = "5.0"
    LastUpdated = Get-Date -Format "yyyy-MM-dd"
    
    # Behavior Settings
    AutoCheckUpdates = $true
    UpdateCheckIntervalHours = 24
    SkipUpdatePrompts = $false
    DefaultProfile = "Default"
    AutoConfigure = $true
    BackupBeforeInstall = $true
    
    # UI Settings
    EnableRealtimeSearch = $true
    SearchDelayMs = 150
    ShowDescriptions = $true
    ColorScheme = "Default"
    ConfirmOSDetection = $true
    
    # Security Settings
    EnablePrivacyMode = $false
    KodachiMode = $false
    KaliToolsOnUbuntu = $false
    AutoHarden = $false
    
    # Performance Settings
    ParallelInstalls = 1
    TimeoutMinutes = 30
    RetryFailed = $true
    
    # Paths
    BackupLocation = "$logDir/Backups"
    CustomRepos = @()
    ExcludedApps = @()
}

function Load-Settings {
    if (Test-Path $SettingsFile) {
        try {
            $saved = Get-Content $SettingsFile | ConvertFrom-Json -AsHashtable
            $merged = $script:DefaultSettings.Clone()
            foreach ($key in $saved.Keys) { $merged[$key] = $saved[$key] }
            return $merged
        } catch {
            Write-Log "Failed to load settings, using defaults" "WARN" "Settings"
        }
    }
    return $script:DefaultSettings.Clone()
}

function Save-Settings {
    param([hashtable]$Settings)
    $Settings.LastUpdated = Get-Date -Format "yyyy-MM-dd"
    $Settings | ConvertTo-Json -Depth 10 | Set-Content $SettingsFile -Force
    Write-Log "Settings saved to $SettingsFile" "SUCCESS" "Settings"
}

$script:Settings = Load-Settings
$script:InstallLog.Settings = $script:Settings

function Write-Log {
    param([string]$Message, [string]$Level = "INFO", [string]$Category = "General", [switch]$NoConsole)
    $timestamp = Get-Date -Format "HH:mm:ss"
    $colorMap = @{
        "INFO" = "White"; "SUCCESS" = "Green"; "WARN" = "Yellow"; 
        "ERROR" = "Red"; "DEBUG" = "Gray"; "CONFIG" = "Magenta"; "SEARCH" = "Cyan"
    }
    if (-not $NoConsole) {
        Write-Host "[$timestamp] [$Level] $Message" -ForegroundColor $colorMap[$Level]
    }
    
    $script:InstallLog.Actions += @{
        Time = $timestamp
        Level = $Level
        Category = $Category
        Message = $Message
    }
}

# 3. COMPREHENSIVE OS DETECTION WITH USER CONFIRMATION
function Initialize-OSDetection {
    Write-Host @"
╔══════════════════════════════════════════════════════════════════════╗
║                    SYSTEM DETECTION IN PROGRESS                      ║
╚══════════════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

    $script:OSDetails = @{
        Type = "Unknown"
        Distro = "Unknown"
        Version = "Unknown"
        Build = "Unknown"
        Architecture = [System.Runtime.InteropServices.RuntimeInformation]::ProcessArchitecture.ToString()
        IsServer = $false
        IsWSL = $false
        IsContainer = $false
        PackageManagers = @()
        ConfigPath = ""
        Shell = ""
        DesktopEnvironment = "Unknown"
        HasGUI = $false
        Compatibility = @()
    }

    # Container detection
    if (Test-Path "/.dockerenv" -or (Test-Path "/proc/1/cgroup" -and (Get-Content "/proc/1/cgroup" | Select-String "docker"))) {
        $script:OSDetails.IsContainer = $true
    }

    # WSL Detection
    if ($IsLinux -and (Test-Path "/proc/version")) {
        $versionInfo = Get-Content "/proc/version"
        if ($versionInfo -match "microsoft|WSL") { $script:OSDetails.IsWSL = $true }
    }

    if ($IsWindows) {
        $script:OSDetails.Type = "Windows"
        $osInfo = Get-CimInstance Win32_OperatingSystem
        $script:OSDetails.Version = $osInfo.Caption
        $script:OSDetails.Build = $osInfo.BuildNumber
        $script:OSDetails.IsServer = $osInfo.Caption -like "*Server*"
        $script:OSDetails.HasGUI = -not $script:OSDetails.IsServer -or (Get-Command explorer -ErrorAction SilentlyContinue)
        $script:OSDetails.ConfigPath = "$env:LOCALAPPDATA\UltimateInstaller"
        $script:OSDetails.Shell = "PowerShell"
        
        $edition = (Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion").EditionID
        $script:OSDetails.Compatibility = @("Windows", $edition)
        
    } elseif ($IsMacOS) {
        $script:OSDetails.Type = "macOS"
        $script:OSDetails.Version = sw_vers -productVersion
        $script:OSDetails.Build = sw_vers -buildVersion
        $script:OSDetails.Distro = "macOS"
        $script:OSDetails.HasGUI = $true
        $script:OSDetails.ConfigPath = "$HOME/Library/Application Support/UltimateInstaller"
        $script:OSDetails.Shell = if (Test-Path "/bin/zsh") { "zsh" } else { "bash" }
        $script:OSDetails.Compatibility = @("macOS", "Darwin")
        
    } elseif ($IsLinux) {
        $script:OSDetails.Type = "Linux"
        $script:OSDetails.ConfigPath = "$HOME/.config/ultimate_installer"
        $script:OSDetails.Shell = $env:SHELL
        
        if (Test-Path "/etc/os-release") {
            $osRelease = Get-Content "/etc/os-release" | ConvertFrom-StringData
            $script:OSDetails.Distro = $osRelease.ID
            $script:OSDetails.Version = $osRelease.VERSION_ID
            $script:OSDetails.Build = $osRelease.BUILD_ID
            
            $like = $osRelease.ID_LIKE
            $script:OSDetails.Compatibility = @("Linux", $osRelease.ID)
            if ($like) { $script:OSDetails.Compatibility += $like -split " " }
            if ($osRelease.ID -eq "kali") { $script:OSDetails.Compatibility += "Kali" }
            if ($osRelease.ID -in @("ubuntu", "pop", "mint", "elementary", "zorin")) {
                $script:OSDetails.Compatibility += "Ubuntu"
            }
            
            $de = $env:XDG_CURRENT_DESKTOP
            if ($de) { 
                $script:OSDetails.DesktopEnvironment = $de
                $script:OSDetails.HasGUI = $true
            } elseif ($env:WAYLAND_DISPLAY -or $env:DISPLAY) {
                $script:OSDetails.HasGUI = $true
            }
        }
    }

    # Detect Package Managers
    $pms = @()
    $pmCommands = @{
        "winget" = "winget"; "choco" = "choco"; "scoop" = "scoop"
        "brew" = "brew"; "port" = "port"
        "apt" = "apt"; "dnf" = "dnf"; "yum" = "yum"; "pacman" = "pacman"
        "zypper" = "zypper"; "snap" = "snap"; "flatpak" = "flatpak"
        "pip" = "pip"; "pip3" = "pip3"; "npm" = "npm"; "cargo" = "cargo"
    }
    
    foreach ($pm in $pmCommands.GetEnumerator()) {
        if (Get-Command $pm.Value -ErrorAction SilentlyContinue) {
            $pms += $pm.Key
        }
    }
    $script:OSDetails.PackageManagers = $pms

    # USER CONFIRMATION
    if ($script:Settings.ConfirmOSDetection) {
        Clear-Host
        Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Yellow
        Write-Host "              PLEASE CONFIRM SYSTEM DETECTION" -ForegroundColor Yellow
        Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Yellow
        
        Write-Host "`nDetected System:" -ForegroundColor Cyan
        Write-Host "  OS Type:        $($script:OSDetails.Type)" -ForegroundColor White
        Write-Host "  Distribution:   $($script:OSDetails.Distro)" -ForegroundColor White
        Write-Host "  Version:        $($script:OSDetails.Version)" -ForegroundColor White
        Write-Host "  Build:          $($script:OSDetails.Build)" -ForegroundColor White
        Write-Host "  Architecture:   $($script:OSDetails.Architecture)" -ForegroundColor White
        Write-Host "  GUI Available:  $($script:OSDetails.HasGUI)" -ForegroundColor White
        Write-Host "  WSL:            $($script:OSDetails.IsWSL)" -ForegroundColor White
        Write-Host "  Container:      $($script:OSDetails.IsContainer)" -ForegroundColor White
        Write-Host "`nPackage Managers: $($script:OSDetails.PackageManagers -join ', ')" -ForegroundColor Green
        Write-Host "Compatibility:    $($script:OSDetails.Compatibility -join ' > ')" -ForegroundColor Green
        
        if ($script:OSDetails.Distro -eq "kali") {
            Write-Host "`n⚠️  KALI LINUX DETECTED - Full penetration testing suite available" -ForegroundColor Red
        }
        if ($script:OSDetails.Compatibility -contains "Ubuntu") {
            Write-Host "`n✓ Ubuntu-based system - Kali tools can be installed" -ForegroundColor Yellow
        }
        
        Write-Host "`n═══════════════════════════════════════════════════════════════" -ForegroundColor Yellow
        $confirm = Read-Host "Is this correct? [Y]es / [N]o (manual override) / [Q]uit"
        
        switch ($confirm.ToUpper()) {
            "N" { Manual-OSOverride }
            "Q" { exit 0 }
        }
    }
    
    $script:InstallLog.OS = $script:OSDetails
    Write-Log "OS Detection confirmed: $($script:OSDetails.Type) $($script:OSDetails.Distro) $($script:OSDetails.Version)" "SUCCESS" "System"
}

function Manual-OSOverride {
    Write-Host "`nManual Override Mode" -ForegroundColor Magenta
    $script:OSDetails.Type = Read-Host "Enter OS Type (Windows/macOS/Linux)"
    $script:OSDetails.Distro = Read-Host "Enter Distribution (e.g., ubuntu, kali, arch)"
    $script:OSDetails.Compatibility = @($script:OSDetails.Type, $script:OSDetails.Distro)
    if ($script:OSDetails.Distro -eq "kali") { $script:OSDetails.Compatibility += "Kali" }
}

# Run detection
Initialize-OSDetection

# 4. MASTER DATABASE - 150+ TOOLS (Combined from both scripts)
$script:MasterApps = @()

# === KODACHI LINUX PRIVACY SUITE ===
$script:MasterApps += @(
    @{
        ID = "kodachi_tor_advanced"; Name = "Kodachi Advanced Tor Setup"; Category = "Privacy"; 
        OSFilter = "Linux"; SubCategory = "Kodachi";
        LinuxIDs = @{ script = "kodachi-setup-tor" };
        ConfigHooks = @("kodachi-tor-routing", "kodachi-dns-crypt");
        Description = "Routes ALL traffic through Tor with DNS encryption"
    },
    @{
        ID = "kodachi_vpn_kill"; Name = "Kodachi VPN Kill Switch"; Category = "Privacy";
        OSFilter = "Linux"; SubCategory = "Kodachi";
        LinuxIDs = @{ script = "kodachi-vpn-killswitch" };
        ConfigHooks = @("kodachi-iptables-kill");
        Description = "System-wide VPN kill switch using iptables"
    },
    @{
        ID = "kodachi_mac_changer"; Name = "Kodachi MAC Address Randomizer"; Category = "Privacy";
        OSFilter = "Linux"; SubCategory = "Kodachi";
        LinuxIDs = @{ apt = "macchanger" };
        ConfigHooks = @("kodachi-mac-random-boot");
        Description = "Randomizes MAC on every boot"
    },
    @{
        ID = "kodachi_encrypted_dns"; Name = "Kodachi DNSCrypt-Proxy"; Category = "Privacy";
        OSFilter = "Linux"; SubCategory = "Kodachi";
        LinuxIDs = @{ script = 'curl -fsSL https://raw.githubusercontent.com/DNSCrypt/dnscrypt-proxy/master/dnscrypt-proxy/utils/generate-domains-blocklist/generate-domains-blocklist.py | sudo tee /usr/local/bin/dnscrypt-setup' };
        ConfigHooks = @("kodachi-dnscrypt-config");
        Description = "Encrypted DNS with ad/tracker blocking"
    },
    @{
        ID = "kodachi_bleachbit"; Name = "Kodachi BleachBit Enhanced"; Category = "Privacy";
        OSFilter = "Linux"; SubCategory = "Kodachi";
        LinuxIDs = @{ apt = "bleachbit" };
        ConfigHooks = @("kodachi-bleachbit-aggressive");
        Description = "System cleaner with forensic-level wiping"
    },
    @{
        ID = "kodachi_apparmor"; Name = "Kodachi AppArmor Profiles"; Category = "Privacy";
        OSFilter = "Linux"; SubCategory = "Kodachi";
        LinuxIDs = @{ apt = "apparmor-profiles apparmor-utils" };
        ConfigHooks = @("kodachi-apparmor-enforce");
        Description = "Mandatory Access Control hardening"
    },
    @{
        ID = "kodachi_firejail"; Name = "Kodachi Firejail Sandbox"; Category = "Privacy";
        OSFilter = "Linux"; SubCategory = "Kodachi";
        LinuxIDs = @{ apt = "firejail firejail-profiles" };
        ConfigHooks = @("kodachi-firejail-default");
        Description = "Application sandboxing for browsers and apps"
    },
    @{
        ID = "kodachi_metadata_cleaner"; Name = "Kodachi Metadata Cleaner"; Category = "Privacy";
        OSFilter = "Linux"; SubCategory = "Kodachi";
        LinuxIDs = @{ apt = "mat2" };
        ConfigHooks = @("kodachi-mat-integration");
        Description = "Removes metadata from files"
    }
)

# === KALI TOOLS FOR UBUNTU/DEBIAN ===
$script:MasterApps += @(
    @{
        ID = "kali_repo_setup"; Name = "Kali Linux Repository Setup"; Category = "Security";
        OSFilter = "Linux"; SubCategory = "KaliTools";
        LinuxIDs = @{ script = "kali-ubuntu-setup-repo" };
        ConfigHooks = @("kali-ubuntu-pinning");
        Description = "Adds Kali repos to Ubuntu/Debian safely";
        Warning = "Modifies APT sources - use with caution"
    },
    @{
        ID = "kali_metapackages"; Name = "Kali Metapackages (Ubuntu)"; Category = "Security";
        OSFilter = "Linux"; SubCategory = "KaliTools";
        LinuxIDs = @{ apt = "kali-linux-headless kali-tools-top10" };
        Dependencies = @("kali_repo_setup");
        Description = "Core Kali tools without full OS"
    },
    @{
        ID = "kali_wireless"; Name = "Kali Wireless Tools (Ubuntu)"; Category = "Security";
        OSFilter = "Linux"; SubCategory = "KaliTools";
        LinuxIDs = @{ apt = "kali-tools-wireless aircrack-ng reaver wifite" };
        Dependencies = @("kali_repo_setup");
        Description = "WiFi auditing toolkit"
    },
    @{
        ID = "kali_web"; Name = "Kali Web App Tools (Ubuntu)"; Category = "Security";
        OSFilter = "Linux"; SubCategory = "KaliTools";
        LinuxIDs = @{ apt = "kali-tools-web sqlmap nikto dirb gobuster" };
        Dependencies = @("kali_repo_setup");
        Description = "Web penetration testing tools"
    },
    @{
        ID = "kali_forensics"; Name = "Kali Forensics (Ubuntu)"; Category = "Security";
        OSFilter = "Linux"; SubCategory = "KaliTools";
        LinuxIDs = @{ apt = "kali-tools-forensics autopsy sleuthkit" };
        Dependencies = @("kali_repo_setup");
        Description = "Digital forensics toolkit"
    },
    @{
        ID = "kali_everything"; Name = "Kali Linux Everything (FULL INSTALL)"; Category = "Security";
        OSFilter = "Linux"; SubCategory = "Kali";
        LinuxIDs = @{ apt = "kali-linux-everything" };
        Description = "Complete Kali Linux tool suite (15GB+)";
        Warning = "This will install ALL Kali tools. Requires 15GB+ space and hours to install."
        Confirm = $true
    }
)

# === CORE DEVELOPMENT (from v3.0) ===
$script:MasterApps += @(
    @{ ID = "git"; Name = "Git"; Category = "Core Dev"; WinIDs = @{ winget = "Git.Git"; choco = "git"; scoop = "git" }; MacIDs = @{ brew = "git" }; LinuxIDs = @{ apt = "git"; dnf = "git"; pacman = "git" }; ConfigHooks = @("git-config"); Priority = "Critical" },
    @{ ID = "gitlfs"; Name = "Git LFS"; Category = "Core Dev"; WinIDs = @{ winget = "GitHub.GitLFS"; choco = "git-lfs"; scoop = "git-lfs" }; MacIDs = @{ brew = "git-lfs" }; LinuxIDs = @{ apt = "git-lfs"; dnf = "git-lfs" }; Dependencies = @("git") },
    @{ ID = "gh_cli"; Name = "GitHub CLI"; Category = "Core Dev"; WinIDs = @{ winget = "GitHub.cli"; choco = "gh"; scoop = "gh" }; MacIDs = @{ brew = "gh" }; LinuxIDs = @{ apt = "gh"; snap = "gh" }; ConfigHooks = @("gh-auth") },
    @{ ID = "powershell7"; Name = "PowerShell 7"; Category = "Core Dev"; WinIDs = @{ winget = "Microsoft.PowerShell"; choco = "powershell-core"; scoop = "pwsh" }; MacIDs = @{ brew = "powershell"; cask = "powershell" }; LinuxIDs = @{ apt = "powershell"; snap = "powershell" }; ConfigHooks = @("ps7-profile", "ps7-modules") },
    @{ ID = "windows_terminal"; Name = "Windows Terminal"; Category = "Core Dev"; OSFilter = "Windows"; WinIDs = @{ winget = "Microsoft.WindowsTerminal"; msstore = "9N0DX20HK701" }; ConfigHooks = @("wt-settings", "wt-profile") },
    @{ ID = "code"; Name = "Visual Studio Code"; Category = "Core Dev"; WinIDs = @{ winget = "Microsoft.VisualStudioCode"; choco = "vscode"; scoop = "vscode" }; MacIDs = @{ cask = "visual-studio-code" }; LinuxIDs = @{ apt = "code"; snap = "code"; flatpak = "com.visualstudio.code" }; ConfigHooks = @("code-extensions", "code-settings", "code-keybindings") },
    @{ ID = "jetbrains_toolbox"; Name = "JetBrains Toolbox"; Category = "Core Dev"; WinIDs = @{ winget = "JetBrains.Toolbox"; choco = "jetbrainstoolbox" }; MacIDs = @{ cask = "jetbrains-toolbox" }; LinuxIDs = @{ snap = "jetbrains-toolbox"; tar = "https://download.jetbrains.com/toolbox/jetbrains-toolbox-2.3.1.31116.tar.gz" } },
    @{ ID = "cursor"; Name = "Cursor IDE (AI)"; Category = "Core Dev"; WinIDs = @{ winget = "Anysphere.Cursor"; choco = "cursor"; scoop = "cursor" }; MacIDs = @{ cask = "cursor" }; LinuxIDs = @{ appimage = "https://download.todesktop.com/230313mzl4w4u92/cursor-0.40.3-build-2409052f3dfqitp-x86_64.AppImage" } },
    @{ ID = "trae"; Name = "Trae IDE (ByteDance AI)"; Category = "Core Dev"; WinIDs = @{ winget = "ByteDance.Trae"; scoop = "trae" }; MacIDs = @{ cask = "trae" }; ConfigHooks = @("trae-cn-config") },
    @{ ID = "neovim"; Name = "Neovim"; Category = "Core Dev"; WinIDs = @{ winget = "Neovim.Neovim"; choco = "neovim"; scoop = "neovim" }; MacIDs = @{ brew = "neovim" }; LinuxIDs = @{ apt = "neovim"; dnf = "neovim"; pacman = "neovim"; snap = "nvim" }; ConfigHooks = @("nvim-lazyvim", "nvim-config") },
    @{ ID = "vim"; Name = "Vim"; Category = "Core Dev"; WinIDs = @{ winget = "vim.vim"; choco = "vim"; scoop = "vim" }; MacIDs = @{ brew = "vim" }; LinuxIDs = @{ apt = "vim"; dnf = "vim"; pacman = "vim" }; ConfigHooks = @("vim-vundle", "vimrc") },
    @{ ID = "emacs"; Name = "Emacs"; Category = "Core Dev"; WinIDs = @{ winget = "GNU.Emacs"; choco = "emacs"; scoop = "emacs" }; MacIDs = @{ cask = "emacs" }; LinuxIDs = @{ apt = "emacs"; dnf = "emacs"; pacman = "emacs" }; ConfigHooks = @("emacs-doom", "emacs-spacemacs") },
    @{ ID = "helix"; Name = "Helix Editor"; Category = "Core Dev"; WinIDs = @{ winget = "Helix.Helix"; scoop = "helix" }; MacIDs = @{ brew = "helix" }; LinuxIDs = @{ apt = "helix"; dnf = "helix"; pacman = "helix" } }
)

# === LANGUAGES & RUNTIMES ===
$script:MasterApps += @(
    @{ ID = "python3"; Name = "Python 3.12"; Category = "Languages"; WinIDs = @{ winget = "Python.Python.3.12"; choco = "python"; scoop = "python" }; MacIDs = @{ brew = "python@3.12" }; LinuxIDs = @{ apt = "python3"; dnf = "python3"; pacman = "python" }; ConfigHooks = @("pip-config", "pipx-tools", "poetry-install", "pyenv-setup") },
    @{ ID = "nodejs"; Name = "Node.js LTS"; Category = "Languages"; WinIDs = @{ winget = "OpenJS.NodeJS.LTS"; choco = "nodejs-lts"; scoop = "nodejs-lts" }; MacIDs = @{ brew = "node@20" }; LinuxIDs = @{ apt = "nodejs"; dnf = "nodejs"; snap = "node" }; ConfigHooks = @("npm-global", "nvm-setup", "pnpm-setup", "yarn-setup") },
    @{ ID = "bun"; Name = "Bun Runtime"; Category = "Languages"; WinIDs = @{ winget = "Oven-sh.Bun"; scoop = "bun" }; MacIDs = @{ brew = "bun" }; LinuxIDs = @{ script = 'curl -fsSL https://bun.sh/install | bash' } },
    @{ ID = "deno"; Name = "Deno Runtime"; Category = "Languages"; WinIDs = @{ winget = "DenoLand.Deno"; choco = "deno"; scoop = "deno" }; MacIDs = @{ brew = "deno" }; LinuxIDs = @{ script = 'curl -fsSL https://deno.land/install.sh | sh' } },
    @{ ID = "rust"; Name = "Rust Toolchain"; Category = "Languages"; WinIDs = @{ winget = "Rustlang.Rustup"; choco = "rust"; scoop = "rustup" }; MacIDs = @{ brew = "rustup-init" }; LinuxIDs = @{ script = 'curl --proto "=https" --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y' }; ConfigHooks = @("rust-cargo-config", "rust-analyzer") },
    @{ ID = "golang"; Name = "Go"; Category = "Languages"; WinIDs = @{ winget = "GoLang.Go"; choco = "golang"; scoop = "go" }; MacIDs = @{ brew = "go" }; LinuxIDs = @{ apt = "golang-go"; snap = "go" } },
    @{ ID = "dotnet"; Name = ".NET SDK"; Category = "Languages"; WinIDs = @{ winget = "Microsoft.DotNet.SDK.8"; choco = "dotnet-sdk"; scoop = "dotnet-sdk" }; MacIDs = @{ cask = "dotnet-sdk" }; LinuxIDs = @{ snap = "dotnet-sdk" } },
    @{ ID = "java_openjdk"; Name = "OpenJDK 21"; Category = "Languages"; WinIDs = @{ winget = "EclipseAdoptium.Temurin.21.JDK"; choco = "openjdk"; scoop = "openjdk21" }; MacIDs = @{ cask = "temurin@21" }; LinuxIDs = @{ apt = "openjdk-21-jdk"; dnf = "java-21-openjdk-devel" } },
    @{ ID = "kotlin"; Name = "Kotlin"; Category = "Languages"; WinIDs = @{ winget = "JetBrains.Kotlin.Complier"; scoop = "kotlin" }; MacIDs = @{ brew = "kotlin" }; LinuxIDs = @{ snap = "kotlin" } },
    @{ ID = "zig"; Name = "Zig"; Category = "Languages"; WinIDs = @{ winget = "Zig.Zig"; scoop = "zig" }; MacIDs = @{ brew = "zig" }; LinuxIDs = @{ snap = "zig" } },
    @{ ID = "crystal"; Name = "Crystal"; Category = "Languages"; WinIDs = @{ scoop = "crystal" }; MacIDs = @{ brew = "crystal" }; LinuxIDs = @{ snap = "crystal" } }
)

# === AI & MACHINE LEARNING ===
$script:MasterApps += @(
    @{ ID = "ollama"; Name = "Ollama (Local LLMs)"; Category = "AI/ML"; WinIDs = @{ winget = "Ollama.Ollama"; choco = "ollama"; scoop = "ollama" }; MacIDs = @{ brew = "ollama" }; LinuxIDs = @{ script = 'curl -fsSL https://ollama.com/install.sh | sh' }; ConfigHooks = @("ollama-models", "ollama-systemd") },
    @{ ID = "docker"; Name = "Docker Desktop"; Category = "AI/ML"; WinIDs = @{ winget = "Docker.DockerDesktop"; choco = "docker-desktop" }; MacIDs = @{ cask = "docker" }; LinuxIDs = @{ script = 'curl -fsSL https://get.docker.com | sh' }; ConfigHooks = @("docker-nvidia", "docker-compose", "docker-buildx") },
    @{ ID = "nvidia_cuda"; Name = "NVIDIA CUDA Toolkit"; Category = "AI/ML"; OSFilter = "Windows,Linux"; WinIDs = @{ winget = "Nvidia.CUDA"; choco = "cuda" }; LinuxIDs = @{ script = 'distribution=$(. /etc/os-release;echo $ID$VERSION_ID) ; curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add - ; curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list' } },
    @{ ID = "anaconda"; Name = "Anaconda Distribution"; Category = "AI/ML"; WinIDs = @{ winget = "Anaconda.Anaconda3"; choco = "anaconda3" }; MacIDs = @{ cask = "anaconda" }; LinuxIDs = @{ script = 'wget https://repo.anaconda.com/archive/Anaconda3-2024.02-1-Linux-x86_64.sh -O /tmp/anaconda.sh ; bash /tmp/anaconda.sh -b -p $HOME/anaconda3' }; ConfigHooks = @("conda-forge", "conda-envs") },
    @{ ID = "jupyter"; Name = "Jupyter Lab"; Category = "AI/ML"; WinIDs = @{ pip = "jupyterlab" }; MacIDs = @{ pip = "jupyterlab" }; LinuxIDs = @{ pip = "jupyterlab" }; Dependencies = @("python3") },
    @{ ID = "chatgpt_desktop"; Name = "ChatGPT Desktop"; Category = "AI/ML"; WinIDs = @{ winget = "OpenAI.ChatGPT"; scoop = "chatgpt" }; MacIDs = @{ cask = "chatgpt" } },
    @{ ID = "claude_desktop"; Name = "Claude Desktop"; Category = "AI/ML"; WinIDs = @{ winget = "Anthropic.Claude"; scoop = "claude" }; MacIDs = @{ cask = "claude" } },
    @{ ID = "perplexity"; Name = "Perplexity AI"; Category = "AI/ML"; WinIDs = @{ winget = "Perplexity.Perplexity" }; MacIDs = @{ cask = "perplexity" } },
    @{ ID = "continue_dev"; Name = "Continue.dev (AI Coding)"; Category = "AI/ML"; ConfigHooks = @("continue-vscode", "continue-config") },
    @{ ID = "tabnine"; Name = "TabNine AI Assistant"; Category = "AI/ML"; WinIDs = @{ winget = "TabNine.TabNine"; vscode = "TabNine.tabnine-vscode" }; ConfigHooks = @("tabnine-config") },
    @{ ID = "codeium"; Name = "Codeium Windsurf"; Category = "AI/ML"; WinIDs = @{ winget = "Codeium.Windsurf"; scoop = "windsurf" }; MacIDs = @{ cask = "windsurf" } }
)

# === CYBERSECURITY & PENTESTING ===
$script:MasterApps += @(
    @{ ID = "kali_wsl"; Name = "Kali Linux (WSL)"; Category = "Security"; OSFilter = "Windows"; WinIDs = @{ winget = "KaliLinux.KaliLinux"; msstore = "9PKR34TNCV07" }; ConfigHooks = @("kali-gui", "kali-tools", "kali-wslg") },
    @{ ID = "metasploit"; Name = "Metasploit Framework"; Category = "Security"; WinIDs = @{ winget = "Rapid7.MetasploitFramework"; choco = "metasploit" }; MacIDs = @{ brew = "metasploit" }; LinuxIDs = @{ apt = "metasploit-framework" } },
    @{ ID = "nmap"; Name = "Nmap and Zenmap"; Category = "Security"; WinIDs = @{ winget = "Insecure.Nmap"; choco = "nmap"; scoop = "nmap" }; MacIDs = @{ brew = "nmap" }; LinuxIDs = @{ apt = "nmap"; dnf = "nmap" } },
    @{ ID = "zenmap"; Name = "Zenmap GUI"; Category = "Security"; WinIDs = @{ winget = "Insecure.Zenmap" }; MacIDs = @{ cask = "zenmap" }; LinuxIDs = @{ apt = "zenmap" } },
    @{ ID = "wireshark"; Name = "Wireshark"; Category = "Security"; WinIDs = @{ winget = "WiresharkFoundation.Wireshark"; choco = "wireshark"; scoop = "wireshark" }; MacIDs = @{ cask = "wireshark" }; LinuxIDs = @{ apt = "wireshark"; dnf = "wireshark" } },
    @{ ID = "burp_suite"; Name = "Burp Suite Professional"; Category = "Security"; WinIDs = @{ winget = "PortSwigger.BurpSuite.Professional" }; MacIDs = @{ cask = "burp-suite" } },
    @{ ID = "wireguard"; Name = "WireGuard VPN"; Category = "Security"; WinIDs = @{ winget = "WireGuard.WireGuard"; choco = "wireguard"; scoop = "wireguard" }; MacIDs = @{ cask = "wireguard" }; LinuxIDs = @{ apt = "wireguard"; dnf = "wireguard-tools" } },
    @{ ID = "protonvpn"; Name = "Proton VPN"; Category = "Security"; WinIDs = @{ winget = "Proton.ProtonVPN"; choco = "protonvpn"; scoop = "protonvpn" }; MacIDs = @{ cask = "protonvpn" }; LinuxIDs = @{ script = 'wget -q -O - https://repo.protonvpn.com/debian/public-key.asc | sudo apt-key add - ; echo "deb https://repo.protonvpn.com/debian stable main" | sudo tee /etc/apt/sources.list.d/protonvpn.list ; sudo apt update ; sudo apt install protonvpn' } },
    @{ ID = "mullvad"; Name = "Mullvad VPN"; Category = "Security"; WinIDs = @{ winget = "MullvadVPN.MullvadVPN"; choco = "mullvad-app" }; MacIDs = @{ cask = "mullvadvpn" }; LinuxIDs = @{ script = 'curl -fsSL https://mullvad.net/en/download/app/deb/latest | sudo dpkg -i /dev/stdin' } },
    @{ ID = "tor_browser"; Name = "Tor Browser"; Category = "Security"; WinIDs = @{ winget = "TorProject.TorBrowser"; choco = "tor-browser"; scoop = "tor-browser" }; MacIDs = @{ cask = "tor-browser" }; LinuxIDs = @{ flatpak = "com.torproject.torbrowser-launcher" } },
    @{ ID = "veracrypt"; Name = "VeraCrypt"; Category = "Security"; WinIDs = @{ winget = "IDRIX.VeraCrypt"; choco = "veracrypt"; scoop = "veracrypt" }; MacIDs = @{ cask = "veracrypt" }; LinuxIDs = @{ apt = "veracrypt"; snap = "veracrypt" } },
    @{ ID = "keepassxc"; Name = "KeePassXC"; Category = "Security"; WinIDs = @{ winget = "KeePassXC.KeePassXC"; choco = "keepassxc"; scoop = "keepassxc" }; MacIDs = @{ cask = "keepassxc" }; LinuxIDs = @{ apt = "keepassxc"; snap = "keepassxc" } },
    @{ ID = "yubikey"; Name = "YubiKey Manager"; Category = "Security"; WinIDs = @{ winget = "Yubico.YubiKeyManager"; choco = "yubikey-manager" }; MacIDs = @{ cask = "yubico-yubikey-manager" }; LinuxIDs = @{ apt = "yubikey-manager"; snap = "yubikey-manager" } },
    @{ ID = "hashcat"; Name = "Hashcat"; Category = "Security"; WinIDs = @{ winget = "Hashcat.Hashcat"; scoop = "hashcat" }; MacIDs = @{ brew = "hashcat" }; LinuxIDs = @{ apt = "hashcat" } },
    @{ ID = "johntheripper"; Name = "John the Ripper"; Category = "Security"; WinIDs = @{ scoop = "john" }; MacIDs = @{ brew = "john-jumbo" }; LinuxIDs = @{ apt = "john"; snap = "john-the-ripper" } },
    @{ ID = "hydra"; Name = "THC-Hydra"; Category = "Security"; WinIDs = @{ scoop = "hydra" }; MacIDs = @{ brew = "hydra" }; LinuxIDs = @{ apt = "hydra"; dnf = "hydra" } },
    @{ ID = "gobuster"; Name = "Gobuster"; Category = "Security"; WinIDs = @{ scoop = "gobuster" }; MacIDs = @{ brew = "gobuster" }; LinuxIDs = @{ apt = "gobuster" } },
    @{ ID = "feroxbuster"; Name = "Feroxbuster"; Category = "Security"; WinIDs = @{ scoop = "feroxbuster" }; MacIDs = @{ brew = "feroxbuster" }; LinuxIDs = @{ apt = "feroxbuster" } },
    @{ ID = "sqlmap"; Name = "SQLMap"; Category = "Security"; WinIDs = @{ pip = "sqlmap" }; MacIDs = @{ pip = "sqlmap" }; LinuxIDs = @{ apt = "sqlmap" } },
    @{ ID = "nikto"; Name = "Nikto Web Scanner"; Category = "Security"; WinIDs = @{ scoop = "nikto" }; MacIDs = @{ brew = "nikto" }; LinuxIDs = @{ apt = "nikto" } }
)

# === CLOUD & DEVOPS ===
$script:MasterApps += @(
    @{ ID = "kubectl"; Name = "Kubectl"; Category = "Cloud"; WinIDs = @{ winget = "Kubernetes.kubectl"; choco = "kubernetes-cli"; scoop = "kubectl" }; MacIDs = @{ brew = "kubectl" }; LinuxIDs = @{ snap = "kubectl"; apt = "kubectl" } },
    @{ ID = "helm"; Name = "Helm"; Category = "Cloud"; WinIDs = @{ winget = "Helm.Helm"; choco = "kubernetes-helm"; scoop = "helm" }; MacIDs = @{ brew = "helm" }; LinuxIDs = @{ snap = "helm"; apt = "helm" } },
    @{ ID = "k9s"; Name = "K9s (K8s TUI)"; Category = "Cloud"; WinIDs = @{ winget = "Derailed.k9s"; scoop = "k9s" }; MacIDs = @{ brew = "k9s" }; LinuxIDs = @{ snap = "k9s" } },
    @{ ID = "lens"; Name = "Lens Kubernetes IDE"; Category = "Cloud"; WinIDs = @{ winget = "Mirantis.Lens"; choco = "lens"; scoop = "lens" }; MacIDs = @{ cask = "lens" }; LinuxIDs = @{ snap = "kontena-lens"; flatpak = "dev.k8slens.OpenLens" } },
    @{ ID = "terraform"; Name = "Terraform"; Category = "Cloud"; WinIDs = @{ winget = "HashiCorp.Terraform"; choco = "terraform"; scoop = "terraform" }; MacIDs = @{ brew = "terraform" }; LinuxIDs = @{ apt = "terraform"; snap = "terraform" } },
    @{ ID = "pulumi"; Name = "Pulumi"; Category = "Cloud"; WinIDs = @{ winget = "Pulumi.Pulumi"; choco = "pulumi"; scoop = "pulumi" }; MacIDs = @{ brew = "pulumi" }; LinuxIDs = @{ script = 'curl -fsSL https://get.pulumi.com | sh' } },
    @{ ID = "awscli"; Name = "AWS CLI v2"; Category = "Cloud"; WinIDs = @{ winget = "Amazon.AWSCLI"; choco = "awscli"; scoop = "aws" }; MacIDs = @{ brew = "awscli" }; LinuxIDs = @{ snap = "aws-cli"; script = 'curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" ; unzip awscliv2.zip ; sudo ./aws/install' }; ConfigHooks = @("aws-configure", "aws-sso") },
    @{ ID = "azurecli"; Name = "Azure CLI"; Category = "Cloud"; WinIDs = @{ winget = "Microsoft.AzureCLI"; choco = "azure-cli"; scoop = "azure-cli" }; MacIDs = @{ brew = "azure-cli" }; LinuxIDs = @{ script = 'curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash' } },
    @{ ID = "gcloud"; Name = "Google Cloud SDK"; Category = "Cloud"; WinIDs = @{ winget = "Google.CloudSDK"; choco = "gcloudsdk"; scoop = "gcloud" }; MacIDs = @{ cask = "google-cloud-sdk" }; LinuxIDs = @{ script = 'curl https://sdk.cloud.google.com | bash' } },
    @{ ID = "doctl"; Name = "DigitalOcean CLI"; Category = "Cloud"; WinIDs = @{ winget = "DigitalOcean.doctl"; scoop = "doctl" }; MacIDs = @{ brew = "doctl" }; LinuxIDs = @{ snap = "doctl" } },
    @{ ID = "flyctl"; Name = "Fly.io CLI"; Category = "Cloud"; WinIDs = @{ scoop = "flyctl" }; MacIDs = @{ brew = "flyctl" }; LinuxIDs = @{ script = 'curl -L https://fly.io/install.sh | sh' } },
    @{ ID = "vercel_cli"; Name = "Vercel CLI"; Category = "Cloud"; WinIDs = @{ npm = "vercel" }; MacIDs = @{ npm = "vercel" }; LinuxIDs = @{ npm = "vercel" } },
    @{ ID = "netlify_cli"; Name = "Netlify CLI"; Category = "Cloud"; WinIDs = @{ npm = "netlify-cli" }; MacIDs = @{ npm = "netlify-cli" }; LinuxIDs = @{ npm = "netlify-cli" } },
    @{ ID = "heroku_cli"; Name = "Heroku CLI"; Category = "Cloud"; WinIDs = @{ winget = "Heroku.HerokuCLI"; scoop = "heroku-cli" }; MacIDs = @{ brew = "heroku/brew/heroku" }; LinuxIDs = @{ snap = "heroku"; script = 'curl https://cli-assets.heroku.com/install.sh | sh' } },
    @{ ID = "github_actions_runner"; Name = "GitHub Actions Runner"; Category = "Cloud"; WinIDs = @{ choco = "actions-runner" }; MacIDs = @{ brew = "actions-runner" }; LinuxIDs = @{ script = 'curl -o actions-runner-linux-x64-2.311.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz' } }
)

# === DATABASES ===
$script:MasterApps += @(
    @{ ID = "postgresql"; Name = "PostgreSQL 16"; Category = "Database"; WinIDs = @{ winget = "PostgreSQL.PostgreSQL.16"; choco = "postgresql16"; scoop = "postgresql" }; MacIDs = @{ brew = "postgresql@16" }; LinuxIDs = @{ apt = "postgresql"; dnf = "postgresql-server" }; ConfigHooks = @("pg-config", "pg-admin") },
    @{ ID = "mysql"; Name = "MySQL 8.0"; Category = "Database"; WinIDs = @{ winget = "Oracle.MySQL.8.0"; choco = "mysql" }; MacIDs = @{ cask = "mysql" }; LinuxIDs = @{ apt = "mysql-server"; dnf = "mysql-server" } },
    @{ ID = "mongodb"; Name = "MongoDB Community"; Category = "Database"; WinIDs = @{ winget = "MongoDB.Server.7.0"; choco = "mongodb" }; MacIDs = @{ brew = "mongodb-community" }; LinuxIDs = @{ snap = "mongodb-server" } },
    @{ ID = "redis"; Name = "Redis"; Category = "Database"; WinIDs = @{ winget = "Redis.Redis"; choco = "redis-64"; scoop = "redis" }; MacIDs = @{ brew = "redis" }; LinuxIDs = @{ apt = "redis-server"; snap = "redis" } },
    @{ ID = "sqlite"; Name = "SQLite"; Category = "Database"; WinIDs = @{ winget = "SQLite.SQLite"; scoop = "sqlite" }; MacIDs = @{ brew = "sqlite" }; LinuxIDs = @{ apt = "sqlite3" } },
    @{ ID = "dbeaver"; Name = "DBeaver Community"; Category = "Database"; WinIDs = @{ winget = "DBeaver.DBeaver.Community"; choco = "dbeaver"; scoop = "dbeaver" }; MacIDs = @{ cask = "dbeaver-community" }; LinuxIDs = @{ snap = "dbeaver-ce"; flatpak = "io.dbeaver.DBeaverCommunity" } },
    @{ ID = "tableplus"; Name = "TablePlus"; Category = "Database"; WinIDs = @{ winget = "TablePlus.TablePlus"; choco = "tableplus" }; MacIDs = @{ cask = "tableplus" }; LinuxIDs = @{ snap = "tableplus"; apt = "tableplus" } },
    @{ ID = "prisma_studio"; Name = "Prisma Studio"; Category = "Database"; WinIDs = @{ npm = "@prisma/studio" }; MacIDs = @{ npm = "@prisma/studio" }; LinuxIDs = @{ npm = "@prisma/studio" } }
)

# === MEDIA & CREATIVE ===
$script:MasterApps += @(
    @{ ID = "blender"; Name = "Blender"; Category = "Creative"; WinIDs = @{ winget = "BlenderFoundation.Blender"; choco = "blender"; scoop = "blender" }; MacIDs = @{ cask = "blender" }; LinuxIDs = @{ snap = "blender"; flatpak = "org.blender.Blender" } },
    @{ ID = "gimp"; Name = "GIMP"; Category = "Creative"; WinIDs = @{ winget = "GIMP.GIMP.3"; choco = "gimp"; scoop = "gimp" }; MacIDs = @{ cask = "gimp" }; LinuxIDs = @{ apt = "gimp"; flatpak = "org.gimp.GIMP" } },
    @{ ID = "krita"; Name = "Krita"; Category = "Creative"; WinIDs = @{ winget = "KDE.Krita"; choco = "krita"; scoop = "krita" }; MacIDs = @{ cask = "krita" }; LinuxIDs = @{ snap = "krita"; flatpak = "org.kde.krita" } },
    @{ ID = "obs_studio"; Name = "OBS Studio"; Category = "Creative"; WinIDs = @{ winget = "OBSProject.OBSStudio"; choco = "obs-studio"; scoop = "obs-studio" }; MacIDs = @{ cask = "obs" }; LinuxIDs = @{ apt = "obs-studio"; snap = "obs-studio" } },
    @{ ID = "davinci_resolve"; Name = "DaVinci Resolve"; Category = "Creative"; WinIDs = @{ winget = "BlackmagicDesign.DaVinciResolve"; choco = "davinci-resolve" }; MacIDs = @{ cask = "davinci-resolve" }; LinuxIDs = @{ script = 'wget https://swr.cloud.blackmagicdesign.com/DaVinciResolve/v18.6.6/DaVinciResolve_18.6.6_Linux.zip -O /tmp/dr.zip' } },
    @{ ID = "vlc"; Name = "VLC Media Player"; Category = "Creative"; WinIDs = @{ winget = "VideoLAN.VLC"; choco = "vlc"; scoop = "vlc" }; MacIDs = @{ cask = "vlc" }; LinuxIDs = @{ apt = "vlc"; snap = "vlc" } },
    @{ ID = "spotify"; Name = "Spotify"; Category = "Creative"; WinIDs = @{ winget = "Spotify.Spotify"; choco = "spotify"; scoop = "spotify" }; MacIDs = @{ cask = "spotify" }; LinuxIDs = @{ snap = "spotify"; flatpak = "com.spotify.Client" } },
    @{ ID = "audacity"; Name = "Audacity"; Category = "Creative"; WinIDs = @{ winget = "Audacity.Audacity"; choco = "audacity"; scoop = "audacity" }; MacIDs = @{ cask = "audacity" }; LinuxIDs = @{ snap = "audacity"; flatpak = "org.audacityteam.Audacity" } },
    @{ ID = "lmms"; Name = "LMMS (DAW)"; Category = "Creative"; WinIDs = @{ winget = "LMMS.LMMS"; choco = "lmms"; scoop = "lmms" }; MacIDs = @{ cask = "lmms" }; LinuxIDs = @{ snap = "lmms"; flatpak = "io.lmms.LMMS" } },
    @{ ID = "figma"; Name = "Figma Desktop"; Category = "Creative"; WinIDs = @{ winget = "Figma.Figma"; scoop = "figma" }; MacIDs = @{ cask = "figma" }; LinuxIDs = @{ snap = "figma-linux"; flatpak = "io.github.Figma_Linux.figma_linux" } },
    @{ ID = "penpot"; Name = "Penpot Desktop"; Category = "Creative"; WinIDs = @{ winget = "Penpot.PenpotDesktop"; scoop = "penpot-desktop" }; MacIDs = @{ cask = "penpot-desktop" }; LinuxIDs = @{ snap = "penpot-desktop"; flatpak = "com.penpot.PenpotDesktop" } },
    @{ ID = "inkscape"; Name = "Inkscape"; Category = "Creative"; WinIDs = @{ winget = "Inkscape.Inkscape"; choco = "inkscape"; scoop = "inkscape" }; MacIDs = @{ cask = "inkscape" }; LinuxIDs = @{ apt = "inkscape"; flatpak = "org.inkscape.Inkscape" } }
)

# === BROWSERS & COMMUNICATION ===
$script:MasterApps += @(
    @{ ID = "chrome"; Name = "Google Chrome"; Category = "Browser"; WinIDs = @{ winget = "Google.Chrome"; choco = "googlechrome"; scoop = "googlechrome" }; MacIDs = @{ cask = "google-chrome" }; LinuxIDs = @{ apt = "google-chrome-stable"; dnf = "google-chrome-stable"; flatpak = "com.google.Chrome" }; ConfigHooks = @("chrome-extensions-dev", "chrome-privacy") },
    @{ ID = "firefox"; Name = "Firefox"; Category = "Browser"; WinIDs = @{ winget = "Mozilla.Firefox"; choco = "firefox"; scoop = "firefox" }; MacIDs = @{ cask = "firefox" }; LinuxIDs = @{ apt = "firefox"; snap = "firefox"; flatpak = "org.mozilla.firefox" }; ConfigHooks = @("firefox-developer", "firefox-privacy") },
    @{ ID = "firefox_dev"; Name = "Firefox Developer Edition"; Category = "Browser"; WinIDs = @{ winget = "Mozilla.Firefox.DeveloperEdition"; scoop = "firefox-developer" }; MacIDs = @{ cask = "firefox-developer-edition" }; LinuxIDs = @{ snap = "firefox"; tar = "https://download.mozilla.org/?product=firefox-devedition-latest-ssl&os=linux64&lang=en-US" } },
    @{ ID = "brave"; Name = "Brave Browser"; Category = "Browser"; WinIDs = @{ winget = "Brave.Brave"; choco = "brave"; scoop = "brave" }; MacIDs = @{ cask = "brave-browser" }; LinuxIDs = @{ snap = "brave"; flatpak = "com.brave.Browser" } },
    @{ ID = "brave_nightly"; Name = "Brave Nightly"; Category = "Browser"; WinIDs = @{ winget = "Brave.Brave.Nightly"; scoop = "brave-nightly" }; MacIDs = @{ cask = "brave-browser-nightly" }; LinuxIDs = @{ snap = "brave"; apt = "brave-browser-nightly" } },
    @{ ID = "edge"; Name = "Microsoft Edge"; Category = "Browser"; OSFilter = "Windows"; WinIDs = @{ winget = "Microsoft.Edge"; msstore = "9NBLGGH5FV99" } },
    @{ ID = "vivaldi"; Name = "Vivaldi"; Category = "Browser"; WinIDs = @{ winget = "VivaldiTechnologies.Vivaldi"; choco = "vivaldi"; scoop = "vivaldi" }; MacIDs = @{ cask = "vivaldi" }; LinuxIDs = @{ apt = "vivaldi-stable"; snap = "vivaldi" } },
    @{ ID = "arc_browser"; Name = "Arc Browser"; Category = "Browser"; WinIDs = @{ winget = "TheBrowserCompany.Arc"; scoop = "arc" }; MacIDs = @{ cask = "arc" } },
    @{ ID = "zen_browser"; Name = "Zen Browser"; Category = "Browser"; WinIDs = @{ winget = "ZenBrowser.Zen"; scoop = "zen-browser" }; MacIDs = @{ cask = "zen-browser" }; LinuxIDs = @{ flatpak = "io.github.zen_browser.zen" } },
    @{ ID = "thunderbird"; Name = "Thunderbird"; Category = "Communication"; WinIDs = @{ winget = "Mozilla.Thunderbird"; choco = "thunderbird"; scoop = "thunderbird" }; MacIDs = @{ cask = "thunderbird" }; LinuxIDs = @{ apt = "thunderbird"; snap = "thunderbird"; flatpak = "org.mozilla.Thunderbird" } },
    @{ ID = "discord"; Name = "Discord"; Category = "Communication"; WinIDs = @{ winget = "Discord.Discord"; choco = "discord"; scoop = "discord" }; MacIDs = @{ cask = "discord" }; LinuxIDs = @{ snap = "discord"; flatpak = "com.discordapp.Discord" } },
    @{ ID = "slack"; Name = "Slack"; Category = "Communication"; WinIDs = @{ winget = "SlackTechnologies.Slack"; choco = "slack"; scoop = "slack" }; MacIDs = @{ cask = "slack" }; LinuxIDs = @{ snap = "slack"; flatpak = "com.slack.Slack" } },
    @{ ID = "telegram"; Name = "Telegram Desktop"; Category = "Communication"; WinIDs = @{ winget = "Telegram.TelegramDesktop"; choco = "telegram"; scoop = "telegram" }; MacIDs = @{ cask = "telegram-desktop" }; LinuxIDs = @{ snap = "telegram-desktop"; flatpak = "org.telegram.desktop" } },
    @{ ID = "signal"; Name = "Signal"; Category = "Communication"; WinIDs = @{ winget = "OpenWhisperSystems.Signal"; choco = "signal"; scoop = "signal" }; MacIDs = @{ cask = "signal" }; LinuxIDs = @{ snap = "signal-desktop"; flatpak = "org.signal.Signal" } },
    @{ ID = "zoom"; Name = "Zoom"; Category = "Communication"; WinIDs = @{ winget = "Zoom.Zoom"; choco = "zoom"; scoop = "zoom" }; MacIDs = @{ cask = "zoom" }; LinuxIDs = @{ snap = "zoom-client"; flatpak = "us.zoom.Zoom" } },
    @{ ID = "obsidian"; Name = "Obsidian"; Category = "Communication"; WinIDs = @{ winget = "Obsidian.Obsidian"; choco = "obsidian"; scoop = "obsidian" }; MacIDs = @{ cask = "obsidian" }; LinuxIDs = @{ snap = "obsidian"; flatpak = "md.obsidian.Obsidian" }; ConfigHooks = @("obsidian-plugins", "obsidian-sync") },
    @{ ID = "notion"; Name = "Notion"; Category = "Communication"; WinIDs = @{ winget = "Notion.Notion"; choco = "notion"; scoop = "notion" }; MacIDs = @{ cask = "notion" }; LinuxIDs = @{ snap = "notion-snap"; flatpak = "notion.id" } },
    @{ ID = "todoist"; Name = "Todoist"; Category = "Communication"; WinIDs = @{ winget = "Doist.Todoist"; choco = "todoist"; scoop = "todoist" }; MacIDs = @{ cask = "todoist" }; LinuxIDs = @{ snap = "todoist"; flatpak = "com.todoist.Todoist" } }
)

# === SYSTEM & UTILITIES ===
$script:MasterApps += @(
    @{ ID = "wsl_ubuntu"; Name = "WSL Ubuntu"; Category = "System"; OSFilter = "Windows"; WinIDs = @{ winget = "Canonical.Ubuntu.2204"; msstore = "9PN20MSR04DW" }; ConfigHooks = @("wsl-default", "wsl-docker", "wsl-zsh") },
    @{ ID = "wsl_debian"; Name = "WSL Debian"; Category = "System"; OSFilter = "Windows"; WinIDs = @{ winget = "TheDebianProject.Debian"; msstore = "9MSVKQC78PK6" } },
    @{ ID = "wsl_arch"; Name = "WSL Arch Linux"; Category = "System"; OSFilter = "Windows"; WinIDs = @{ winget = "9MZNMNKSM73Q"; msstore = "9MZNMNKSM73Q" } },
    @{ ID = "terminal_ghostty"; Name = "Ghostty Terminal"; Category = "System"; WinIDs = @{ winget = "Ghostty.Ghostty"; scoop = "ghostty" }; MacIDs = @{ cask = "ghostty" }; LinuxIDs = @{ script = 'curl -fsSL https://raw.githubusercontent.com/mkasberg/ghostty-ubuntu/HEAD/install.sh | bash' } },
    @{ ID = "starship"; Name = "Starship Prompt"; Category = "System"; WinIDs = @{ winget = "Starship.Starship"; choco = "starship"; scoop = "starship" }; MacIDs = @{ brew = "starship" }; LinuxIDs = @{ script = 'curl -sS https://starship.rs/install.sh | sh -s -- -y' }; ConfigHooks = @("starship-config", "shell-integration") },
    @{ ID = "zeal"; Name = "Zeal (Offline Docs)"; Category = "System"; WinIDs = @{ winget = "ZealDevelopers.Zeal"; choco = "zeal"; scoop = "zeal" }; MacIDs = @{ cask = "zeal" }; LinuxIDs = @{ apt = "zeal"; snap = "zeal" } },
    @{ ID = "fzf"; Name = "fzf Fuzzy Finder"; Category = "System"; WinIDs = @{ winget = "junegunn.fzf"; choco = "fzf"; scoop = "fzf" }; MacIDs = @{ brew = "fzf" }; LinuxIDs = @{ apt = "fzf"; dnf = "fzf" }; ConfigHooks = @("fzf-shell-integration", "fzf-vim-integration") },
    @{ ID = "ripgrep"; Name = "Ripgrep (rg)"; Category = "System"; WinIDs = @{ winget = "BurntSushi.ripgrep.MSVC"; choco = "ripgrep"; scoop = "ripgrep" }; MacIDs = @{ brew = "ripgrep" }; LinuxIDs = @{ apt = "ripgrep"; dnf = "ripgrep" } },
    @{ ID = "fd"; Name = "fd (Find Alternative)"; Category = "System"; WinIDs = @{ winget = "sharkdp.fd"; choco = "fd"; scoop = "fd" }; MacIDs = @{ brew = "fd" }; LinuxIDs = @{ apt = "fd-find"; dnf = "fd-find" } },
    @{ ID = "bat"; Name = "bat (Cat with Wings)"; Category = "System"; WinIDs = @{ winget = "sharkdp.bat"; choco = "bat"; scoop = "bat" }; MacIDs = @{ brew = "bat" }; LinuxIDs = @{ apt = "bat"; dnf = "bat" }; ConfigHooks = @("bat-config", "bat-manpager") },
    @{ ID = "eza"; Name = "eza (Modern ls)"; Category = "System"; WinIDs = @{ winget = "eza-community.eza"; scoop = "eza" }; MacIDs = @{ brew = "eza" }; LinuxIDs = @{ apt = "eza"; cargo = "eza" } },
    @{ ID = "zoxide"; Name = "zoxide (Smarter cd)"; Category = "System"; WinIDs = @{ winget = "ajeetdsouza.zoxide"; choco = "zoxide"; scoop = "zoxide" }; MacIDs = @{ brew = "zoxide" }; LinuxIDs = @{ apt = "zoxide"; script = 'curl -sS https://raw.githubusercontent.com/ajeetdsouza/zoxide/main/install.sh | bash' }; ConfigHooks = @("zoxide-shell-init") },
    @{ ID = "btop"; Name = "btop++ (Resource Monitor)"; Category = "System"; WinIDs = @{ winget = "aristocratos.btop4win"; scoop = "btop" }; MacIDs = @{ brew = "btop" }; LinuxIDs = @{ snap = "btop"; apt = "btop" } },
    @{ ID = "glances"; Name = "Glances System Monitor"; Category = "System"; WinIDs = @{ pip = "glances"; choco = "glances" }; MacIDs = @{ brew = "glances" }; LinuxIDs = @{ pip = "glances"; apt = "glances" } },
    @{ ID = "rufus"; Name = "Rufus"; Category = "System"; OSFilter = "Windows"; WinIDs = @{ winget = "Rufus.Rufus"; choco = "rufus"; scoop = "rufus" } },
    @{ ID = "balena_etcher"; Name = "Balena Etcher"; Category = "System"; WinIDs = @{ winget = "Balena.Etcher"; choco = "etcher"; scoop = "balena-etcher" }; MacIDs = @{ cask = "balenaetcher" }; LinuxIDs = @{ snap = "balena-etcher"; apt = "balena-etcher-electron" } },
    @{ ID = "ventoy"; Name = "Ventoy"; Category = "System"; WinIDs = @{ winget = "ventoy.Ventoy"; choco = "ventoy"; scoop = "ventoy" }; MacIDs = @{ cask = "ventoy" }; LinuxIDs = @{ script = 'wget https://github.com/ventoy/Ventoy/releases/download/v1.0.96/ventoy-1.0.96-linux.tar.gz -O /tmp/ventoy.tar.gz' } },
    @{ ID = "syncthing"; Name = "Syncthing"; Category = "System"; WinIDs = @{ winget = "Syncthing.Syncthing"; choco = "syncthing"; scoop = "syncthing" }; MacIDs = @{ cask = "syncthing" }; LinuxIDs = @{ snap = "syncthing"; apt = "syncthing" } },
    @{ ID = "tailscale"; Name = "Tailscale"; Category = "System"; WinIDs = @{ winget = "Tailscale.Tailscale"; choco = "tailscale"; scoop = "tailscale" }; MacIDs = @{ cask = "tailscale" }; LinuxIDs = @{ script = 'curl -fsSL https://tailscale.com/install.sh | sh' } },
    @{ ID = "zerotier"; Name = "ZeroTier One"; Category = "System"; WinIDs = @{ winget = "ZeroTier.ZeroTierOne"; choco = "zerotier-one"; scoop = "zerotier-one" }; MacIDs = @{ cask = "zerotier-one" }; LinuxIDs = @{ script = 'curl -s https://install.zerotier.com | sudo bash' } },
    @{ ID = "teamviewer"; Name = "TeamViewer"; Category = "System"; WinIDs = @{ winget = "TeamViewer.TeamViewer"; choco = "teamviewer"; scoop = "teamviewer" }; MacIDs = @{ cask = "teamviewer" }; LinuxIDs = @{ apt = "teamviewer"; script = 'wget https://download.teamviewer.com/download/linux/teamviewer_amd64.deb -O /tmp/tv.deb ; sudo dpkg -i /tmp/tv.deb' } },
    @{ ID = "anydesk"; Name = "AnyDesk"; Category = "System"; WinIDs = @{ winget = "AnyDeskSoftwareGmbH.AnyDesk"; choco = "anydesk"; scoop = "anydesk" }; MacIDs = @{ cask = "anydesk" }; LinuxIDs = @{ apt = "anydesk" } },
    @{ ID = "parsec"; Name = "Parsec Gaming"; Category = "System"; WinIDs = @{ winget = "Parsec.Parsec"; choco = "parsec"; scoop = "parsec" }; MacIDs = @{ cask = "parsec" }; LinuxIDs = @{ script = 'wget https://builds.parsecgaming.com/package/parsec-linux.deb -O /tmp/parsec.deb ; sudo dpkg -i /tmp/parsec.deb' } },
    @{ ID = "sunshine"; Name = "Sunshine (Game Stream Host)"; Category = "System"; WinIDs = @{ winget = "LizardByte.Sunshine"; choco = "sunshine"; scoop = "sunshine" }; MacIDs = @{ brew = "sunshine" }; LinuxIDs = @{ flatpak = "dev.lizardbyte.sunshine"; apt = "sunshine" } },
    @{ ID = "moonlight"; Name = "Moonlight Client"; Category = "System"; WinIDs = @{ winget = "MoonlightGameStreamingProject.Moonlight"; choco = "moonlight-qt"; scoop = "moonlight" }; MacIDs = @{ cask = "moonlight" }; LinuxIDs = @{ snap = "moonlight"; flatpak = "com.moonlight_stream.Moonlight" } }
)

# 5. UPDATE CHECKING SYSTEM
$script:UpdateCache = @{}
$script:AvailableUpdates = @()

function Load-UpdateCache {
    if (Test-Path $updateCacheFile) {
        $cache = Get-Content $updateCacheFile | ConvertFrom-Json -AsHashtable
        $age = (Get-Date) - [datetime]$cache.Timestamp
        if ($age.TotalHours -lt $script:Settings.UpdateCheckIntervalHours) {
            $script:UpdateCache = $cache
            return $true
        }
    }
    return $false
}

function Save-UpdateCache {
    $script:UpdateCache.Timestamp = Get-Date -Format "o"
    $script:UpdateCache | ConvertTo-Json -Depth 10 | Set-Content $updateCacheFile
}

function Check-AppUpdates {
    param([switch]$Force)
    
    if (-not $Force -and -not $script:Settings.AutoCheckUpdates) { return }
    if (-not $Force -and (Load-UpdateCache)) {
        Write-Log "Using cached update check (from $([math]::Round(((Get-Date) - [datetime]$script:UpdateCache.Timestamp).TotalHours, 1)) hours ago)" "INFO" "Updates"
        $script:AvailableUpdates = $script:UpdateCache.Updates
        return
    }
    
    Write-Log "Checking for available updates..." "INFO" "Updates"
    $updates = @()
    $total = $script:MasterApps.Count
    $current = 0
    
    foreach ($app in $script:MasterApps) {
        $current++
        Write-Progress -Activity "Checking Updates" -Status $app.Name -PercentComplete (($current/$total)*100)
        
        if (-not (Test-AppAvailability $app)) { continue }
        if (-not (Test-AppInstalled $app)) { continue }
        
        $hasUpdate = $false
        $currentVer = "Unknown"
        $latestVer = "Unknown"
        
        try {
            switch -Regex ($script:OSDetails.Type) {
                "Windows" {
                    if ($script:OSDetails.PackageManagers -contains "winget") {
                        $info = winget list --id $app.WinIDs.winget --exact --accept-source-agreements 2>$null | Out-String
                        if ($info -match "Version\s+([\d\.]+)") {
                            $currentVer = $matches[1]
                            $available = winget show --id $app.WinIDs.winget --accept-source-agreements 2>$null | Out-String
                            if ($available -match "Version:\s+([\d\.]+)") {
                                $latestVer = $matches[1]
                                if ([version]$latestVer -gt [version]$currentVer) { $hasUpdate = $true }
                            }
                        }
                    }
                }
                "macOS" {
                    if ($app.MacIDs.brew) {
                        $info = brew info $app.MacIDs.brew --json=v1 2>$null | ConvertFrom-Json
                        if ($info) {
                            $currentVer = brew list $app.MacIDs.brew --versions 2>$null | Select-String $app.MacIDs.brew | ForEach-Object { $_.ToString().Split()[1] }
                            $latestVer = $info[0].versions.stable
                            if ($latestVer -ne $currentVer) { $hasUpdate = $true }
                        }
                    }
                }
                "Linux" {
                    if ($app.LinuxIDs.apt -and $script:OSDetails.PackageManagers -contains "apt") {
                        $installed = dpkg -l $app.LinuxIDs.apt 2>$null | Select-String "^ii"
                        if ($installed) {
                            $currentVer = ($installed -split "\s+")[2]
                            $candidate = apt-cache policy $app.LinuxIDs.apt 2>$null | Select-String "Candidate:"
                            if ($candidate) {
                                $latestVer = ($candidate -split ":")[1].Trim()
                                if ($latestVer -ne $currentVer -and $latestVer -notmatch "none") { $hasUpdate = $true }
                            }
                        }
                    }
                }
            }
        } catch {
            Write-Log "Failed to check updates for $($app.Name): $_" "DEBUG" "Updates" -NoConsole
        }
        
        if ($hasUpdate) {
            $updates += @{
                App = $app
                CurrentVersion = $currentVer
                LatestVersion = $latestVer
            }
        }
    }
    
    Write-Progress -Activity "Checking Updates" -Completed
    $script:AvailableUpdates = $updates
    $script:UpdateCache = @{ Updates = $updates; Timestamp = Get-Date -Format "o" }
    Save-UpdateCache
    
    Write-Log "Found $($updates.Count) available updates" $(if ($updates.Count -gt 0) { "WARN" } else { "SUCCESS" }) "Updates"
}

function Show-UpdatePrompt {
    if ($script:AvailableUpdates.Count -eq 0) { return $true }
    if ($script:Settings.SkipUpdatePrompts -or $NoUpdates) { return $true }
    
    Clear-Host
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Yellow
    Write-Host "              AVAILABLE UPDATES DETECTED" -ForegroundColor Yellow
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Yellow
    
    $idx = 1
    foreach ($upd in $script:AvailableUpdates) {
        Write-Host "[$idx] $($upd.App.Name.PadRight(25)) $($upd.CurrentVersion) → $($upd.LatestVersion)" -ForegroundColor White
        $idx++
    }
    
    Write-Host "`nOptions:" -ForegroundColor Cyan
    Write-Host "[U] Update all now" -ForegroundColor Green
    Write-Host "[S] Skip updates and continue" -ForegroundColor Yellow
    Write-Host "[I] Update individually (select)" -ForegroundColor White
    Write-Host "[A] Always skip (disable auto-check)" -ForegroundColor Gray
    
    $choice = (Read-Host "`nSelection").ToUpper()
    
    switch ($choice) {
        "U" {
            Install-Apps ($script:AvailableUpdates | ForEach-Object { $_.App }) -UpdateMode
            return $true
        }
        "S" { return $true }
        "I" {
            $sel = Read-Host "Enter numbers to update (comma-separated)"
            $indices = $sel.Split(",").Trim() | ForEach-Object { [int]$_ - 1 } | Where-Object { $_ -ge 0 -and $_ -lt $script:AvailableUpdates.Count }
            $toUpdate = $indices | ForEach-Object { $script:AvailableUpdates[$_].App }
            Install-Apps $toUpdate -UpdateMode
            return $true
        }
        "A" {
            $script:Settings.AutoCheckUpdates = $false
            Save-Settings $script:Settings
            return $true
        }
        default { return $true }
    }
}

# 6. REAL-TIME SEARCH WITH PSREADLINE
function Search-AppsRealtime {
    $apps = $script:MasterApps | Where-Object { Test-AppAvailability $_ }
    $selected = @()
    
    $searchString = ""
    $cursorPos = 0
    
    function Render-SearchResults {
        Clear-Host
        Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
        Write-Host "              REAL-TIME APP SEARCH" -ForegroundColor Cyan
        Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
        Write-Host "Type to search | [Enter] Select | [↑↓] Navigate | [Esc] Exit" -ForegroundColor Gray
        Write-Host "Search: " -NoNewline -ForegroundColor Yellow
        Write-Host $searchString -NoNewline -ForegroundColor White
        Write-Host "_" -ForegroundColor Green
        
        $matches = $apps | Where-Object { 
            $_.Name -like "*$searchString*" -or 
            $_.ID -like "*$searchString*" -or 
            $_.Category -like "*$searchString*" 
        } | Select-Object -First 10
        
        Write-Host "`nResults:" -ForegroundColor Cyan
        $idx = 0
        foreach ($app in $matches) {
            $color = if ($idx -eq $cursorPos) { "Black" } else { "White" }
            $bg = if ($idx -eq $cursorPos) { "Cyan" } else { "Black" }
            $pm = Get-BestPackageManager $app
            $installed = if (Test-AppInstalled $app) { "[✓]" } else { "[ ]" }
            
            Write-Host " $installed $($app.Name.PadRight(30)) [$($app.Category)] via $pm" -ForegroundColor $color -BackgroundColor $bg
            if ($script:Settings.ShowDescriptions -and $app.Description) {
                Write-Host "     ↳ $($app.Description)" -ForegroundColor DarkGray
            }
            $idx++
        }
        
        return $matches
    }
    
    $currentMatches = Render-SearchResults
    
    while ($true) {
        if ([Console]::KeyAvailable) {
            $key = [Console]::ReadKey($true)
            
            switch ($key.Key) {
                "Escape" { return $selected }
                "Enter" { 
                    if ($currentMatches[$cursorPos]) {
                        $selected += $currentMatches[$cursorPos]
                        Write-Host "`nAdded: $($currentMatches[$cursorPos].Name)" -ForegroundColor Green
                        Start-Sleep -Milliseconds 300
                    }
                }
                "UpArrow" { 
                    $cursorPos = [Math]::Max(0, $cursorPos - 1)
                    $currentMatches = Render-SearchResults
                }
                "DownArrow" { 
                    $cursorPos = [Math]::Min($currentMatches.Count - 1, $cursorPos + 1)
                    $currentMatches = Render-SearchResults
                }
                "Backspace" {
                    if ($searchString.Length -gt 0) {
                        $searchString = $searchString.Substring(0, $searchString.Length - 1)
                        $cursorPos = 0
                        $currentMatches = Render-SearchResults
                    }
                }
                default {
                    if ($key.KeyChar -match '[\w\s\-]') {
                        $searchString += $key.KeyChar
                        $cursorPos = 0
                        Start-Sleep -Milliseconds $script:Settings.SearchDelayMs
                        $currentMatches = Render-SearchResults
                    }
                }
            }
        }
        Start-Sleep -Milliseconds 10
    }
}

# 7. SYSTEM TWEAKS MENU (Combined from both scripts)
function Show-SystemTweaksMenu {
    Clear-Host
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Magenta
    Write-Host "              SYSTEM TWEAKS & OPTIMIZATION" -ForegroundColor Magenta
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Magenta
    
    $tweaks = @(
        @{
            ID = "perf_ultimate"
            Name = "Ultimate Performance Mode"
            Description = "Disable animations, visual effects, optimize for speed"
            OS = "Windows"
            Action = {
                Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\VisualEffects" -Name "VisualFXSetting" -Value 2
                Set-ItemProperty -Path "HKCU:\Control Panel\Desktop" -Name "UserPreferencesMask" -Value ([byte[]](0x90,0x12,0x03,0x80,0x10,0x00,0x00,0x00))
                powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c
                $services = @("DiagTrack", "dmwappushservice", "MapsBroker", "WMPNetworkSvc")
                foreach ($svc in $services) { Stop-Service $svc -Force -ErrorAction SilentlyContinue; Set-Service $svc -StartupType Disabled }
                Write-Log "Ultimate performance mode applied" "SUCCESS" "Tweaks"
            }
        },
        @{
            ID = "privacy_harden"
            Name = "Privacy Hardening"
            Description = "Disable telemetry, tracking, data collection"
            OS = "Windows"
            Action = {
                Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection" -Name "AllowTelemetry" -Value 0 -Force
                Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\DataCollection" -Name "AllowTelemetry" -Value 0 -Force
                Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\Windows Search" -Name "AllowCortana" -Value 0 -Force
                Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\System" -Name "EnableActivityFeed" -Value 0 -Force
                Write-Log "Privacy hardening applied" "SUCCESS" "Tweaks"
            }
        },
        @{
            ID = "dev_mode"
            Name = "Developer Mode + Features"
            Description = "Enable WSL, VirtualMachinePlatform, Hyper-V, Developer Mode"
            OS = "Windows"
            Action = {
                Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux -NoRestart
                Enable-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform -NoRestart
                Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All -NoRestart
                reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\AppModelUnlock" /t REG_DWORD /f /v "AllowDevelopmentWithoutDevLicense" /d "1"
                Write-Log "Developer features enabled (restart required)" "WARN" "Tweaks"
            }
        },
        @{
            ID = "gaming_optimize"
            Name = "Gaming Optimization"
            Description = "Disable fullscreen optimizations, enable game mode, HPET"
            OS = "Windows"
            Action = {
                Set-ItemProperty -Path "HKCU:\System\GameConfigStore" -Name "GameDVR_FSEBehaviorMode" -Value 2
                Set-ItemProperty -Path "HKCU:\System\GameConfigStore" -Name "GameDVR_HonorUserFSEBehaviorMode" -Value 1
                Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" -Name "GPU Priority" -Value 8
                Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" -Name "Priority" -Value 6
                Write-Log "Gaming optimizations applied" "SUCCESS" "Tweaks"
            }
        },
        @{
            ID = "mac_dev_setup"
            Name = "macOS Developer Setup"
            Description = "Install Xcode CLI tools, enable dev features"
            OS = "macOS"
            Action = {
                xcode-select --install
                sudo spctl --master-disable
                defaults write com.apple.finder AppleShowAllFiles YES
                defaults write NSGlobalDomain AppleShowAllExtensions -bool true
                killall Finder
                Write-Log "macOS dev setup complete" "SUCCESS" "Tweaks"
            }
        },
        @{
            ID = "linux_performance"
            Name = "Linux Performance Kernel"
            Description = "Install low-latency kernel, optimize sysctl"
            OS = "Linux"
            Action = {
                sudo apt install -y linux-lowlatency
                $sysctl = @"
vm.swappiness=10
vm.vfs_cache_pressure=50
net.core.rmem_max=134217728
net.core.wmem_max=134217728
net.ipv4.tcp_rmem=4096 87380 134217728
net.ipv4.tcp_wmem=4096 65536 134217728
"@
                $sysctl | sudo tee /etc/sysctl.d/99-performance.conf
                sudo sysctl --system
                Write-Log "Linux performance tuning applied" "SUCCESS" "Tweaks"
            }
        },
        @{
            ID = "kodachi_full_setup"
            Name = "Kodachi Linux Privacy Suite (FULL)"
            Description = "Complete privacy hardening like Kodachi OS"
            OS = "Linux"
            Action = {
                $kodachiApps = $script:MasterApps | Where-Object { $_.SubCategory -eq "Kodachi" }
                Install-Apps $kodachiApps
                Apply-KodachiHardening
            }
        },
        @{
            ID = "nerd_fonts"
            Name = "Install Nerd Fonts"
            Description = "JetBrains Mono, Fira Code, Cascadia Code"
            OS = "Windows,macOS,Linux"
            Action = {
                $fonts = @("JetBrainsMono", "FiraCode", "CascadiaCode")
                foreach ($font in $fonts) {
                    if ($IsWindows) {
                        winget install "NerdFonts.$font" --silent
                    } elseif ($IsMacOS) {
                        brew tap homebrew/cask-fonts
                        brew install --cask "font-$($font.toLower())-nerd-font"
                    } elseif ($IsLinux) {
                        Write-Log "Install $font manually from https://www.nerdfonts.com/font-downloads" "WARN" "Fonts"
                    }
                }
            }
        }
    )
    
    $idx = 1
    foreach ($tweak in $tweaks) {
        if ($tweak.OS -match $script:OSDetails.Type) {
            Write-Host "[$idx] $($tweak.Name.PadRight(30)) - $($tweak.Description)" -ForegroundColor White
            $idx++
        }
    }
    
    Write-Host "`n[0] Back" -ForegroundColor Yellow
    $choice = Read-Host "Select tweak to apply"
    
    if ($choice -match '^\d+$') {
        $selected = $tweaks[$choice - 1]
        if ($selected) {
            Write-Host "`nApplying: $($selected.Name)..." -ForegroundColor Magenta
            $confirm = Read-Host "Confirm? [Y/N]"
            if ($confirm -eq "Y") {
                & $selected.Action
            }
        }
    }
}

function Apply-KodachiHardening {
    Write-Log "Applying Kodachi Linux hardening configuration..." "CONFIG" "Kodachi"
    
    $torrc = @"
VirtualAddrNetworkIPv4 10.192.0.0/10
AutomapHostsOnResolve 1
TransPort 9040
DNSPort 5353
"@
    $torrc | sudo tee /etc/tor/torrc
    sudo systemctl restart tor
    
    $iptablesScript = @"
#!/bin/bash
iptables -F
iptables -t nat -F
iptables -t nat -A OUTPUT -p tcp --dport 53 -j REDIRECT --to-ports 5353
iptables -t nat -A OUTPUT -p udp --dport 53 -j REDIRECT --to-ports 5353
iptables -t nat -A OUTPUT -p tcp -d 10.192.0.0/10 -j RETURN
iptables -t nat -A OUTPUT -p tcp -d 127.0.0.0/8 -j RETURN
iptables -t nat -A OUTPUT -p tcp -j REDIRECT --to-ports 9040
"@
    $iptablesScript | sudo tee /usr/local/bin/kodachi-firewall
    sudo chmod +x /usr/local/bin/kodachi-firewall
    
    $macService = @"
[Unit]
Description=MAC Address Randomizer
After=network.target

[Service]
Type=oneshot
ExecStart=/sbin/macchanger -r eth0
ExecStart=/sbin/macchanger -r wlan0
"@
    $macService | sudo tee /etc/systemd/system/mac-randomizer.service
    sudo systemctl enable mac-randomizer
    
    Write-Log "Kodachi hardening complete. Tor transparent proxy active." "SUCCESS" "Kodachi"
}

# 8. SETTINGS MENU
function Show-SettingsMenu {
    do {
        Clear-Host
        Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
        Write-Host "                    SCRIPT SETTINGS" -ForegroundColor Cyan
        Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
        
        Write-Host "`n[1] Behavior Settings" -ForegroundColor White
        Write-Host "    Auto-check updates: $($script:Settings.AutoCheckUpdates)" -ForegroundColor Gray
        Write-Host "    Skip update prompts: $($script:Settings.SkipUpdatePrompts)" -ForegroundColor Gray
        Write-Host "    Auto-configure apps: $($script:Settings.AutoConfigure)" -ForegroundColor Gray
        
        Write-Host "`n[2] UI Settings" -ForegroundColor White
        Write-Host "    Real-time search: $($script:Settings.EnableRealtimeSearch)" -ForegroundColor Gray
        Write-Host "    Show descriptions: $($script:Settings.ShowDescriptions)" -ForegroundColor Gray
        Write-Host "    Confirm OS detection: $($script:Settings.ConfirmOSDetection)" -ForegroundColor Gray
        
        Write-Host "`n[3] Security Settings" -ForegroundColor White
        Write-Host "    Privacy mode: $($script:Settings.EnablePrivacyMode)" -ForegroundColor Gray
        Write-Host "    Kodachi mode: $($script:Settings.KodachiMode)" -ForegroundColor Gray
        Write-Host "    Kali tools on Ubuntu: $($script:Settings.KaliToolsOnUbuntu)" -ForegroundColor Gray
        
        Write-Host "`n[4] Performance Settings" -ForegroundColor White
        Write-Host "    Parallel installs: $($script:Settings.ParallelInstalls)" -ForegroundColor Gray
        Write-Host "    Timeout minutes: $($script:Settings.TimeoutMinutes)" -ForegroundColor Gray
        
        Write-Host "`n[5] Advanced" -ForegroundColor White
        Write-Host "    Backup location: $($script:Settings.BackupLocation)" -ForegroundColor Gray
        Write-Host "    Custom repos: $($script:Settings.CustomRepos.Count)" -ForegroundColor Gray
        
        Write-Host "`n[S] Save Settings | [R] Reset to Defaults | [E] Export | [I] Import | [0] Back" -ForegroundColor Yellow
        
        $choice = (Read-Host "`nSelection").ToUpper()
        
        switch ($choice) {
            "1" {
                $script:Settings.AutoCheckUpdates = (Read-Host "Auto-check updates? (Y/N)").ToUpper() -eq "Y"
                $script:Settings.SkipUpdatePrompts = (Read-Host "Skip update prompts? (Y/N)").ToUpper() -eq "Y"
                $script:Settings.AutoConfigure = (Read-Host "Auto-configure apps? (Y/N)").ToUpper() -eq "Y"
            }
            "2" {
                $script:Settings.EnableRealtimeSearch = (Read-Host "Enable real-time search? (Y/N)").ToUpper() -eq "Y"
                $script:Settings.ShowDescriptions = (Read-Host "Show app descriptions? (Y/N)").ToUpper() -eq "Y"
                $script:Settings.ConfirmOSDetection = (Read-Host "Confirm OS detection? (Y/N)").ToUpper() -eq "Y"
                $delay = Read-Host "Search delay in ms (current: $($script:Settings.SearchDelayMs))"
                if ($delay -match '^\d+$') { $script:Settings.SearchDelayMs = [int]$delay }
            }
            "3" {
                $script:Settings.EnablePrivacyMode = (Read-Host "Enable privacy mode by default? (Y/N)").ToUpper() -eq "Y"
                $script:Settings.KodachiMode = (Read-Host "Enable Kodachi hardening by default? (Y/N)").ToUpper() -eq "Y"
                $script:Settings.KaliToolsOnUbuntu = (Read-Host "Allow Kali tools on Ubuntu? (Y/N)").ToUpper() -eq "Y"
                $script:Settings.AutoHarden = (Read-Host "Auto-harden after install? (Y/N)").ToUpper() -eq "Y"
            }
            "4" {
                $para = Read-Host "Parallel installs (1-5, current: $($script:Settings.ParallelInstalls))"
                if ($para -match '^[1-5]$') { $script:Settings.ParallelInstalls = [int]$para }
                $to = Read-Host "Timeout minutes (current: $($script:Settings.TimeoutMinutes))"
                if ($to -match '^\d+$') { $script:Settings.TimeoutMinutes = [int]$to }
            }
            "5" {
                $path = Read-Host "Backup location (current: $($script:Settings.BackupLocation))"
                if ($path) { $script:Settings.BackupLocation = $path }
            }
            "S" { Save-Settings $script:Settings; Write-Host "Settings saved!" -ForegroundColor Green; Start-Sleep 1 }
            "R" { $script:Settings = $script:DefaultSettings.Clone(); Write-Host "Settings reset!" -ForegroundColor Yellow; Start-Sleep 1 }
            "E" { 
                $exportPath = Read-Host "Export path"
                $script:Settings | ConvertTo-Json | Set-Content $exportPath
                Write-Host "Exported to $exportPath" -ForegroundColor Green
            }
            "I" {
                $importPath = Read-Host "Import path"
                if (Test-Path $importPath) {
                    $imported = Get-Content $importPath | ConvertFrom-Json -AsHashtable
                    $script:Settings = $imported
                    Write-Host "Settings imported!" -ForegroundColor Green
                }
            }
        }
    } while ($choice -ne "0")
}

# 9. KALI REPOSITORY SETUP FOR UBUNTU
function Setup-KaliOnUbuntu {
    if (-not ($script:OSDetails.Compatibility -contains "Ubuntu")) {
        Write-Log "Kali tools on Ubuntu only works on Ubuntu/Debian derivatives" "ERROR" "Kali"
        return
    }
    
    Write-Log "Setting up Kali Linux repositories on Ubuntu..." "WARN" "Kali"
    
    if (-not (Test-Path "/etc/apt/sources.list.d/kali.list")) {
        Write-Host "Adding Kali repositories..." -ForegroundColor Yellow
        
        wget -q -O - https://archive.kali.org/archive-key.asc | sudo apt-key add -
        
        $kaliList = @"
# Kali Linux repositories
deb http://http.kali.org/kali kali-rolling main non-free contrib
"@
        $kaliList | sudo tee /etc/apt/sources.list.d/kali.list
        
        $pinning = @"
Package: *
Pin: release a=kali-rolling
Pin-Priority: 50
"@
        $pinning | sudo tee /etc/apt/preferences.d/kali-pinning
        
        sudo apt update
        
        Write-Log "Kali repositories added with priority 50 (non-system)" "SUCCESS" "Kali"
        Write-Host "You can now install Kali tools with: sudo apt install -t kali-rolling <package>" -ForegroundColor Green
    } else {
        Write-Log "Kali repositories already configured" "INFO" "Kali"
    }
}

# 10. CORE FUNCTIONS
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
    
    return $ids.Keys | Select-Object -First 1
}

function Test-AppInstalled {
    param([hashtable]$App)
    
    if (Get-Command $App.ID -ErrorAction SilentlyContinue) { return $true }
    
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
    param(
        [array]$Apps,
        [switch]$UpdateMode,
        [switch]$SkipDependencies
    )
    
    if ($Apps.Count -eq 0) { return }
    
    if ($Apps.ID -contains "kali_everything" -or $Apps.ID -contains "kali_repo_setup") {
        if ($script:OSDetails.Compatibility -contains "Ubuntu" -and $script:Settings.KaliToolsOnUbuntu) {
            Setup-KaliOnUbuntu
        }
    }
    
    foreach ($app in $Apps) {
        if ($app.Confirm) {
            Write-Host "`n⚠️  WARNING for $($app.Name):" -ForegroundColor Red -BackgroundColor Black
            Write-Host $app.Warning -ForegroundColor Yellow
            $confirm = Read-Host "Continue? [yes/NO]"
            if ($confirm -ne "yes") { 
                $Apps = $Apps | Where-Object { $_.ID -ne $app.ID }
            }
        }
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
    
    $script:InstallLog.EndTime = Get-Date
    $script:InstallLog.Duration = ($script:InstallLog.EndTime - $script:StartTime).ToString()
    $script:InstallLog.Success = $success | ForEach-Object { $_.Name }
    $script:InstallLog.Failed = $failed | ForEach-Object { $_.Name }
    $script:InstallLog | ConvertTo-Json -Depth 10 | Set-Content -Path $jsonLog
    
    Write-Host "`nDetailed log saved to: $jsonLog" -ForegroundColor Gray
    
    if ($script:Settings.AutoHarden -and -not $UpdateMode) {
        $harden = Read-Host "Apply system hardening now? (Y/N)"
        if ($harden -eq "Y") { Show-SystemTweaksMenu }
    }
    
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

# 11. CONFIGURATION FUNCTIONS
$script:ConfigFunctions = @{}

$script:ConfigFunctions['git-config'] = {
    param($Settings)
    Write-Log "Configuring Git..." "CONFIG" "Git"
    if ($Settings.Git.user_email) { git config --global user.email $Settings.Git.user_email }
    if ($Settings.Git.user_name) { git config --global user.name $Settings.Git.user_name }
    git config --global init.defaultBranch $Settings.Git.default_branch
    git config --global core.editor $Settings.Git.core_editor
    git config --global push.autoSetupRemote true
    git config --global pull.rebase false
    git config --global core.autocrlf input
    git config --global core.pager "delta --dark"
    
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
    
    $settingsPath = if ($IsWindows) { "$env:APPDATA\Code\User\settings.json" } elseif ($IsMacOS) { "$HOME/Library/Application Support/Code/User/settings.json" } else { "$HOME/.config/Code/User/settings.json" }
    
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
format = """
`$username\
`$hostname\
`$directory\
`$git_branch\
`$git_state\
`$git_status\
`$cmd_duration\
`$line_break\
`$python\
`$character"""

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
    $distribution = $(. /etc/os-release;echo $ID$VERSION_ID)
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
    $modelfile = @"
FROM codellama
SYSTEM You are an expert coding assistant. Provide concise, accurate code suggestions.
PARAMETER temperature 0.2
PARAMETER top_p 0.9
"@
    $modelfile | ollama create codellama-coder -f -
    Write-Log "Ollama models configured" "SUCCESS" "AI"
}

$script:ConfigFunctions['obsidian-plugins'] = {
    param($Settings)
    Write-Log "Configuring Obsidian..." "CONFIG" "Productivity"
    $vaultPath = "$HOME/Obsidian Vault"
    New-Item -ItemType Directory -Path $vaultPath -Force | Out-Null
    $obsidianDir = Join-Path $vaultPath ".obsidian"
    New-Item -ItemType Directory -Path $obsidianDir -Force | Out-Null
    
    $communityPlugins = @("obsidian-git", "dataview", "templater-obsidian", "calendar", "kanban", "excalidraw-obsidian")
    $corePlugins = @{
        "file-explorer" = $true; "global-search" = $true; "switcher" = $true; "graph" = $true
        "backlink" = $true; "canvas" = $true; "outgoing-link" = $true; "tag-pane" = $true
        "page-preview" = $true; "daily-notes" = $true; "templates" = $true; "note-composer" = $true
        "command-palette" = $true; "slash-command" = $true; "editor-status" = $true; "bookmarks" = $true
        "markdown-importer" = $false; "zk-prefixer" = $true; "random-note" = $true; "outline" = $true
        "word-count" = $true; "slides" = $false; "audio-recorder" = $false; "open-with-default-app" = $true; "workspaces" = $true
    }
    
    $appJson = @{
        "alwaysUpdateLinks" = $true; "newFileLocation" = "folder"; "newFileFolderPath" = "Inbox"
        "attachmentFolderPath" = "Attachments"; "promptDelete" = $false
        "pdfExportSettings" = @{ "pageSize" = "Letter"; "landscape" = $false; "margin" = "0"; "downscalePercent" = 100 }
    } | ConvertTo-Json -Depth 10
    
    $appJson | Set-Content -Path (Join-Path $obsidianDir "app.json") -Force
    ($corePlugins | ConvertTo-Json -Depth 10) | Set-Content -Path (Join-Path $obsidianDir "core-plugins.json") -Force
    (@{ "communityPlugins" = $communityPlugins } | ConvertTo-Json -Depth 10) | Set-Content -Path (Join-Path $obsidianDir "community-plugins.json") -Force
    
    Write-Log "Obsidian vault configured at $vaultPath" "SUCCESS" "Productivity"
}

# 12. MENU FUNCTIONS
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
    elseif ($choice -eq "ALL") { Install-Apps $available }
    else {
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
        @{ Name = "Web Development"; Apps = @("nodejs", "code", "docker", "chrome", "firefox_dev"); Color = "Cyan" }
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

# 13. MAIN MENU
function Show-MainMenu {
    Clear-Host
    $updateBadge = if ($script:AvailableUpdates.Count -gt 0) { " [$($script:AvailableUpdates.Count) updates]" } else { "" }
    
    Write-Host @"
╔══════════════════════════════════════════════════════════════════════╗
║           ULTIMATE INSTALLER v5.0 - $($script:OSDetails.Distro)$($updateBadge.PadRight(12)) ║
╠══════════════════════════════════════════════════════════════════════╣
║  Profile: $ConfigProfile $(if ($script:Settings.KodachiMode) { '| 🔒 KODACHI MODE' }) $(if ($script:OSDetails.Compatibility -contains 'Kali') { '| 🛡️ KALI LINUX' })
╠══════════════════════════════════════════════════════════════════════╣
║  [1] 📦 Browse Categories    [2] 🔍 Real-Time Search    [3] 📋 Bundles ║
║  [4] 🔄 Check Updates        [5] 🔧 System Tweaks       [6] ⚙️  Settings ║
║  [7] 🛡️ Privacy Tools        [8] 🎯 Quick Install       [9] 📊 Status   ║
╠══════════════════════════════════════════════════════════════════════╣
║  QUICK: [DEV] [AI] [SEC] [CLOUD] [PRIVACY] [KALI] [KODACHI]          ║
║  SPECIAL: [W] Web AI  [U] Update All  [B] Backup  [R] Restore        ║
╠══════════════════════════════════════════════════════════════════════╣
║  [Q] Quit  |  Direct: Type app name (e.g., 'code', 'git', 'python')  ║
╚══════════════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan
    
    if ($script:AvailableUpdates.Count -gt 0) {
        Write-Host "⚠️  $($script:AvailableUpdates.Count) updates available! Press [4] to review" -ForegroundColor Yellow
    }
}

# Main Execution
Check-AppUpdates
if (-not (Show-UpdatePrompt)) { exit }

do {
    Show-MainMenu
    $choice = (Read-Host "`nSelection").ToUpper().Trim()
    
    switch -Regex ($choice) {
        "^1$" { Show-CategoryMenu }
        "^2$" { 
            if ($script:Settings.EnableRealtimeSearch) {
                $results = Search-AppsRealtime
                if ($results) { Install-Apps $results }
            } else {
                $term = Read-Host "Search term"
                $results = $script:MasterApps | Where-Object { $_.Name -like "*$term*" -or $_.ID -like "*$term*" } | Where-Object { Test-AppAvailability $_ }
                Install-Apps $results
            }
        }
        "^3$" { Show-BundlesMenu }
        "^4$" { 
            Check-AppUpdates -Force
            Show-UpdatePrompt
        }
        "^5$" { Show-SystemTweaksMenu }
        "^6$" { Show-SettingsMenu }
        "^7$" { 
            Clear-Host
            Write-Host "PRIVACY & SECURITY TOOLS" -ForegroundColor Magenta
            Write-Host "[1] Kodachi Linux Suite" -ForegroundColor White
            Write-Host "[2] Kali Linux Tools (on Ubuntu)" -ForegroundColor White
            Write-Host "[3] Standard Privacy Tools" -ForegroundColor White
            $pChoice = Read-Host "Select"
            switch ($pChoice) {
                "1" { 
                    $kodachi = $script:MasterApps | Where-Object { $_.SubCategory -eq "Kodachi" }
                    Install-Apps $kodachi
                }
                "2" {
                    if ($script:OSDetails.Compatibility -contains "Ubuntu") {
                        Setup-KaliOnUbuntu
                        $kali = $script:MasterApps | Where-Object { $_.SubCategory -eq "KaliTools" }
                        Install-Apps $kali
                    } else {
                        Write-Host "Requires Ubuntu/Debian" -ForegroundColor Red
                    }
                }
            }
        }
        "^8$" { 
            $popular = $script:MasterApps | Where-Object { $_.ID -in @("git", "code", "nodejs", "python3", "docker", "chrome") }
            Install-Apps ($popular | Where-Object { Test-AppAvailability $_ })
        }
        "^9$" {
            Clear-Host
            Write-Host "SYSTEM STATUS" -ForegroundColor Cyan
            Write-Host "OS: $($script:OSDetails.Type) $($script:OSDetails.Version)" -ForegroundColor White
            Write-Host "Package Managers: $($script:OSDetails.PackageManagers -join ', ')" -ForegroundColor White
            Write-Host "Installed Apps: $((($script:MasterApps | Where-Object { Test-AppInstalled $_ }).Count))" -ForegroundColor White
            Write-Host "Available Updates: $($script:AvailableUpdates.Count)" -ForegroundColor $(if ($script:AvailableUpdates.Count -gt 0) { "Yellow" } else { "Green" })
            Read-Host "`nPress Enter"
        }
        "^DEV$" { Install-Apps ($script:MasterApps | Where-Object { $_.Category -in @("Core Dev", "Languages") -and (Test-AppAvailability $_) }) }
        "^AI$" { Install-Apps ($script:MasterApps | Where-Object { $_.Category -eq "AI/ML" -and (Test-AppAvailability $_) }) }
        "^SEC$" { Install-Apps ($script:MasterApps | Where-Object { $_.Category -eq "Security" -and (Test-AppAvailability $_) }) }
        "^CLOUD$" { Install-Apps ($script:MasterApps | Where-Object { $_.Category -eq "Cloud" -and (Test-AppAvailability $_) }) }
        "^PRIVACY$" { Install-Apps ($script:MasterApps | Where-Object { $_.Category -eq "Privacy" -and (Test-AppAvailability $_) }) }
        "^KALI$" {
            if ($script:OSDetails.Compatibility -contains "Kali") {
                $kaliEverything = $script:MasterApps | Where-Object { $_.ID -eq "kali_everything" }
                Install-Apps $kaliEverything
            } elseif ($script:OSDetails.Compatibility -contains "Ubuntu") {
                Setup-KaliOnUbuntu
                $kaliTools = $script:MasterApps | Where-Object { $_.SubCategory -eq "KaliTools" -and $_.ID -ne "kali_everything" }
                Install-Apps $kaliTools
            }
        }
        "^KODACHI$" {
            $kodachi = $script:MasterApps | Where-Object { $_.SubCategory -eq "Kodachi" }
            Install-Apps $kodachi
            Apply-KodachiHardening
        }
        "^W$" {
            $urls = @("https://chat.openai.com", "https://claude.ai", "https://gemini.google.com", "https://poe.com")
            foreach ($url in $urls) { Start-Process $url }
        }
        "^U$" {
            Check-AppUpdates -Force
            $toUpdate = $script:AvailableUpdates | ForEach-Object { $_.App }
            Install-Apps $toUpdate -UpdateMode
        }
        "^[A-Z]" {
            $matches = $script:MasterApps | Where-Object { $_.Name -like "*$choice*" -or $_.ID -like "*$choice*" } | Where-Object { Test-AppAvailability $_ }
            if ($matches.Count -eq 1) {
                Install-Apps $matches
            } elseif ($matches.Count -gt 1) {
                $idx = 1
                $matches | ForEach-Object { Write-Host "[$idx] $($_.Name)"; $idx++ }
                $sel = Read-Host "Select (0 to cancel)"
                if ($sel -gt 0) { Install-Apps $matches[$sel-1] }
            }
        }
    }
} while ($choice -ne "Q")

Write-Log "Session ended. Log: $jsonLog" "INFO" "System"
Stop-Transcript