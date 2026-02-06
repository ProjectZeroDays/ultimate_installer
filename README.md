```markdown
# 🚀 Ultimate Cross-Platform System Installer

<p align="center">
  <img src="https://img.shields.io/badge/PowerShell-7.0+-blue.svg" alt="PowerShell 7.0+">
  <img src="https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg" alt="Platforms">
  <img src="https://img.shields.io/badge/Apps-150+-success.svg" alt="150+ Apps">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT License">
</p>

<p align="center">
  <b>Professional-grade automated installer for developers, penetration testers, AI engineers, and privacy enthusiasts.</b><br>
  <i>One script. Every platform. Infinite configurations.</i>
</p>

---

## 📑 Table of Contents

- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [📋 Requirements](#-requirements)
- [💻 Installation](#-installation)
- [🎮 Usage Guide](#-usage-guide)
  - [Main Menu](#main-menu)
  - [Real-Time Search](#real-time-search)
  - [Update Management](#update-management)
  - [System Tweaks](#system-tweaks)
- [🛡️ Security & Privacy](#️-security--privacy)
  - [Kodachi Linux Suite](#kodachi-linux-suite)
  - [Kali Linux Integration](#kali-linux-integration)
- [⚙️ Configuration](#️-configuration)
  - [Built-in Profiles](#built-in-profiles)
  - [Settings File](#settings-file)
  - [Auto-Configuration Hooks](#auto-configuration-hooks)
- [📦 Supported Applications](#-supported-applications)
  - [Core Development](#core-development)
  - [Languages & Runtimes](#languages--runtimes)
  - [AI & Machine Learning](#ai--machine-learning)
  - [Cybersecurity](#cybersecurity)
  - [Cloud & DevOps](#cloud--devops)
  - [Databases](#databases)
  - [Creative Tools](#creative-tools)
  - [System Utilities](#system-utilities)
- [🔧 Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)

---

## ✨ Features

| Feature | Description | Status |
|---------|-------------|--------|
| **🎯 Smart OS Detection** | Automatic platform identification with manual override | ✅ |
| **📦 150+ Applications** | Curated database across 8 categories | ✅ |
| **🔍 Real-Time Search** | PSReadLine-powered fuzzy finding with live filtering | ✅ |
| **🔄 Update Checker** | Cached version checking with selective updates | ✅ |
| **⚡ Multi-Package Managers** | WinGet, Chocolatey, Scoop, Homebrew, APT, DNF, Pacman, Snap, Flatpak | ✅ |
| **🛡️ Kodachi Privacy** | Complete anonymity suite (Tor, MAC randomization, kill switch) | ✅ |
| **🐉 Kali Integration** | Native Kali tools + Ubuntu bridge with safe APT pinning | ✅ |
| **🔧 System Tweaks** | Performance, privacy, gaming, and developer optimizations | ✅ |
| **⚙️ Auto-Configuration** | Profile-based post-install setup | ✅ |
| **💾 Persistent Settings** | JSON-based configuration with import/export | ✅ |

---

## 🚀 Quick Start

### One-Line Install (Recommended)

```powershell
# Windows (PowerShell 7+)
irm https://raw.githubusercontent.com/yourusername/ultimate-installer/main/install.ps1 | iex

# Or download and execute locally
git clone https://github.com/yourusername/ultimate-installer.git
cd ultimate-installer
./install.ps1
```

### First Launch

```powershell
# Run with default settings
./install.ps1

# Run with specific profile
./install.ps1 -ConfigProfile "Cybersecurity"

# Dry run (simulate without installing)
./install.ps1 -DryRun

# Skip update checks
./install.ps1 -NoUpdates
```

---

## 📋 Requirements

### Minimum Requirements

| Component | Version | Notes |
|-----------|---------|-------|
| PowerShell | 7.0+ | Windows PowerShell 5.1 not supported |
| .NET | 6.0+ | Required for some package managers |
| Internet | Broadband | ~500MB for base tools |

### Platform-Specific

#### Windows
- Windows 10 1809+ or Windows 11
- Windows Server 2019+ (GUI tools excluded automatically)
- Administrator rights (for some tweaks)

#### macOS
- macOS 11 (Big Sur)+
- Xcode Command Line Tools (auto-installed if missing)

#### Linux
- Ubuntu 20.04+, Debian 11+, Fedora 35+, Arch Linux
- `sudo` privileges required
- systemd (for service configurations)

---

## 💻 Installation

### Method 1: Direct Download

```powershell
# Create directory
New-Item -ItemType Directory -Path "$HOME/Tools" -Force
Set-Location "$HOME/Tools"

# Download script
Invoke-WebRequest -Uri "https://github.com/yourusername/ultimate-installer/releases/latest/download/install.ps1" -OutFile "install.ps1"

# Execute
./install.ps1
```

### Method 2: Git Clone

```powershell
git clone https://github.com/yourusername/ultimate-installer.git
cd ultimate-installer
./install.ps1 -ConfigProfile "Developer"
```

### Method 3: Package Manager (Future)

```powershell
# WinGet (Coming Soon)
winget install UltimateInstaller

# Homebrew (Coming Soon)
brew install ultimate-installer
```

---

## 🎮 Usage Guide

### Main Menu

```
╔══════════════════════════════════════════════════════════════════════╗
║           ULTIMATE INSTALLER v5.0 - Ubuntu 22.04 [3 updates]         ║
╠══════════════════════════════════════════════════════════════════════╣
║  Profile: Developer | 🔒 KODACHI MODE | 🛡️ KALI LINUX                ║
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
```

**Navigation:**

| Key | Action |
|-----|--------|
| `1` | Browse apps by category |
| `2` | Real-time fuzzy search (if enabled) |
| `3` | Popular bundled selections |
| `4` | Check and manage updates |
| `5` | System optimization tweaks |
| `6` | Configure script settings |
| `7` | Privacy & security tools submenu |
| `8` | Quick install popular apps |
| `9` | View system status |
| `DEV/AI/SEC/CLOUD` | Quick bundle shortcuts |
| `KODACHI` | Full privacy hardening |
| `KALI` | Kali Linux tools |
| `W` | Open AI web portals |
| `U` | Update all apps |

### Real-Time Search

The real-time search feature (enabled by default) provides instant filtering as you type:

```powershell
# Enable in settings or use -EnableRealtimeSearch
./install.ps1 -EnableRealtimeSearch
```

**Controls:**
- **Type** to filter apps instantly
- **↑/↓** Navigate results
- **Enter** Select highlighted app
- **Esc** Exit search

Features:
- Fuzzy matching on name, ID, and category
- Visual indicators for installed apps
- Description preview (if enabled)

### Update Management

The installer automatically checks for updates on launch (configurable interval: default 24h).

**Update Prompt Options:**
- `[U]` Update all detected apps
- `[S]` Skip and continue
- `[I]` Select individual updates
- `[A]` Always skip (disable auto-check)

**Manual Update Check:**
```powershell
./install.ps1 -CheckUpdates
```

### System Tweaks

Access system optimizations via menu `[5]`:

| Tweak | Platform | Description |
|-------|----------|-------------|
| **Ultimate Performance** | Windows | Disable animations, optimize power plan |
| **Privacy Hardening** | Windows/macOS/Linux | Disable telemetry, tracking |
| **Developer Mode** | Windows | WSL, Hyper-V, WinGet dev features |
| **Gaming Optimization** | Windows | Fullscreen optimizations, game mode |
| **macOS Dev Setup** | macOS | Xcode CLI, Finder dev settings |
| **Linux Performance** | Linux | Low-latency kernel, sysctl tuning |
| **Kodachi Full Setup** | Linux | Complete privacy hardening |
| **Nerd Fonts** | All | JetBrains Mono, Fira Code, Cascadia |

---

## 🛡️ Security & Privacy

### Kodachi Linux Suite

Complete privacy hardening inspired by Kodachi OS:

```powershell
# Quick install all Kodachi tools
./install.ps1 -KodachiMode

# Or via menu: [7] → [1]
```

**Components:**

| Tool | Function |
|------|----------|
| **Tor Advanced Setup** | Transparent proxy routing ALL traffic through Tor |
| **VPN Kill Switch** | Iptables-based killswitch prevents leaks |
| **MAC Randomizer** | Automatic MAC address rotation on boot |
| **DNSCrypt-Proxy** | Encrypted DNS with ad/tracker blocking |
| **Firejail** | Application sandboxing for browsers |
| **AppArmor** | Mandatory Access Control profiles |
| **Metadata Cleaner** | MAT2 integration for file sanitization |

**Post-Install Hardening:**
- Tor transparent proxy on ports 9040/5353
- Iptables rules auto-configured
- systemd service for MAC randomization
- DNS-over-HTTPS default

### Kali Linux Integration

**Native Kali:**
```powershell
# On Kali Linux - install everything
[KALI] → Install kali-linux-everything (15GB+)
```

**Ubuntu/Debian Bridge:**
```powershell
# On Ubuntu - install selective tools
./install.ps1 -KaliToolsOnUbuntu

# Setup repository with safe pinning (priority 50)
sudo apt install -t kali-rolling kali-tools-top10
```

**Available Kali Categories:**
- `kali-linux-headless` - Core tools
- `kali-tools-top10` - Most popular tools
- `kali-tools-wireless` - WiFi auditing (aircrack-ng, wifite)
- `kali-tools-web` - Web pentesting (sqlmap, nikto, gobuster)
- `kali-tools-forensics` - Digital forensics (autopsy, sleuthkit)
- `kali-linux-everything` - Complete suite (15GB+)

**Safety Features:**
- APT pinning prevents accidental Kali system upgrade
- Repository priority 50 (below Ubuntu default 500)
- Tools install to standard paths

---

## ⚙️ Configuration

### Built-in Profiles

Select a profile to auto-configure installed apps:

```powershell
./install.ps1 -ConfigProfile "ProfileName"
```

| Profile | Best For | Key Configurations |
|---------|----------|-------------------|
| **Default** | General use | Safe defaults, essential extensions |
| **Developer** | Full-stack dev | VSCode extensions, Git config, Node/Python tools |
| **Cybersecurity** | Pentesting | Burp Suite, Metasploit, Wireshark settings |
| **AI/ML Engineer** | Machine learning | CUDA, Ollama models, Jupyter, Anaconda |
| **Creative Professional** | Content creation | OBS plugins, DaVinci Resolve, Blender addons |
| **Privacy Focused** | Maximum privacy | Hardened Firefox, VPN kill switch, Signal |
| **Minimal** | Low-resource | Essential CLI tools only, no GUI configs |

### Settings File

Persistent configuration stored in `installer_settings.json`:

```json
{
  "Version": "5.0",
  "AutoCheckUpdates": true,
  "UpdateCheckIntervalHours": 24,
  "EnableRealtimeSearch": true,
  "SearchDelayMs": 150,
  "ConfirmOSDetection": true,
  "KodachiMode": false,
  "KaliToolsOnUbuntu": true,
  "ParallelInstalls": 2,
  "AutoHarden": false,
  "BackupLocation": "~/UltimateInstaller/Backups"
}
```

**Modify via Menu:**
```
[6] Settings → [1-5] Category → Save
```

### Auto-Configuration Hooks

Post-install automation for supported apps:

| Hook | Configures |
|------|-----------|
| `git-config` | Global .gitconfig, delta pager, hooks |
| `code-extensions` | VSCode extension marketplace installs |
| `ps7-modules` | PSReadLine, Terminal-Icons, posh-git |
| `starship-config` | Cross-shell prompt theme |
| `docker-nvidia` | NVIDIA Container Toolkit |
| `ollama-models` | Default LLM pulls (llama3.2, codellama, mistral) |
| `obsidian-plugins` | Vault setup with community plugins |
| `nvim-lazyvim` | Neovim configuration framework |

---

## 📦 Supported Applications

### Core Development

| App | Windows | macOS | Linux | Config Hook |
|-----|:-------:|:-----:|:-----:|-------------|
| Git | ✅ | ✅ | ✅ | `git-config` |
| GitHub CLI | ✅ | ✅ | ✅ | `gh-auth` |
| PowerShell 7 | ✅ | ✅ | ✅ | `ps7-modules` |
| Windows Terminal | ✅ | ❌ | ❌ | `wt-settings` |
| VSCode | ✅ | ✅ | ✅ | `code-extensions` |
| JetBrains Toolbox | ✅ | ✅ | ✅ | - |
| Cursor (AI IDE) | ✅ | ✅ | ✅ | - |
| Trae (ByteDance AI) | ✅ | ✅ | ❌ | `trae-cn-config` |
| Neovim | ✅ | ✅ | ✅ | `nvim-lazyvim` |
| Vim | ✅ | ✅ | ✅ | `vim-vundle` |
| Emacs | ✅ | ✅ | ✅ | `emacs-doom` |
| Helix | ✅ | ✅ | ✅ | - |

### Languages & Runtimes

| App | Managers | Notes |
|-----|----------|-------|
| Python 3.12 | winget, brew, apt | poetry, pipx, pyenv setup |
| Node.js LTS | winget, brew, apt | nvm, pnpm, yarn optional |
| Bun | all | JavaScript runtime |
| Deno | all | TypeScript runtime |
| Rust | rustup | cargo config, analyzer |
| Go | winget, brew, apt | - |
| .NET 8 | winget, cask, snap | SDK + runtime |
| OpenJDK 21 | Eclipse Temurin | LTS release |
| Kotlin | all | JVM language |
| Zig | all | Systems programming |
| Crystal | brew, snap | Ruby-like syntax |

### AI & Machine Learning

| App | Function | Special Config |
|-----|----------|---------------|
| Ollama | Local LLM hosting | Model pulls, systemd |
| Docker Desktop | Containerization | NVIDIA runtime option |
| NVIDIA CUDA | GPU compute | Container toolkit |
| Anaconda | Data science platform | conda-forge channels |
| Jupyter Lab | Notebooks | Python dependency |
| ChatGPT Desktop | OpenAI client | - |
| Claude Desktop | Anthropic client | - |
| Perplexity AI | Search assistant | - |
| Continue.dev | AI coding assistant | VSCode integration |
| TabNine | AI code completion | VSCode extension |
| Codeium Windsurf | AI IDE | - |

### Cybersecurity

| App | Category | Platforms |
|-----|----------|-----------|
| Kali Linux (WSL) | Distro | Windows |
| Metasploit | Exploitation | All |
| Nmap/Zenmap | Network scanning | All |
| Wireshark | Packet analysis | All |
| Burp Suite | Web proxy | Win/Mac |
| WireGuard | VPN | All |
| ProtonVPN | VPN | All |
| Mullvad VPN | VPN | All |
| Tor Browser | Anonymity | All |
| VeraCrypt | Encryption | All |
| KeePassXC | Password manager | All |
| YubiKey Manager | 2FA hardware | All |
| Hashcat | Password cracking | All |
| John the Ripper | Password cracking | All |
| THC-Hydra | Brute force | All |
| Gobuster | Directory busting | All |
| Feroxbuster | Directory busting | All |
| SQLMap | SQL injection | All |
| Nikto | Web scanner | All |

### Cloud & DevOps

| App | Purpose |
|-----|---------|
| kubectl | Kubernetes control |
| Helm | K8s package manager |
| k9s | Kubernetes TUI |
| Lens | K8s IDE |
| Terraform | Infrastructure as code |
| Pulumi | IaC (Python/JS/Go) |
| AWS CLI v2 | Amazon Web Services |
| Azure CLI | Microsoft Azure |
| Google Cloud SDK | GCP management |
| doctl | DigitalOcean |
| flyctl | Fly.io deployment |
| Vercel CLI | Frontend deployment |
| Netlify CLI | Static site hosting |
| Heroku CLI | Platform-as-a-Service |
| GitHub Actions Runner | CI/CD self-hosted |

### Databases

| App | Type |
|-----|------|
| PostgreSQL 16 | Relational |
| MySQL 8.0 | Relational |
| MongoDB 7.0 | Document |
| Redis | Key-value |
| SQLite | Embedded |
| DBeaver | Universal GUI |
| TablePlus | Modern GUI |
| Prisma Studio | ORM management |

### Creative Tools

| Category | Apps |
|----------|------|
| 3D/Video | Blender, DaVinci Resolve, OBS Studio |
| Graphics | GIMP, Krita, Inkscape |
| Audio | Audacity, LMMS |
| Design | Figma, Penpot |
| Media | VLC, Spotify |

### System Utilities

| App | Function |
|-----|----------|
| Ghostty | Modern terminal emulator |
| Starship | Cross-shell prompt |
| fzf | Fuzzy finder |
| ripgrep (rg) | Fast search |
| fd | Modern find |
| bat | Syntax-highlighted cat |
| eza | Modern ls |
| zoxide | Smart cd |
| btop++ | Resource monitor |
| Rufus | USB creation (Win) |
| BalenaEtcher | USB creation (All) |
| Ventoy | Multi-boot USB |
| Syncthing | File sync |
| Tailscale | Zero-config VPN |
| ZeroTier | SD-WAN |
| TeamViewer | Remote desktop |
| AnyDesk | Remote desktop |
| Parsec | Game streaming |
| Sunshine | Game stream host |
| Moonlight | Game stream client |

---

## 🔧 Troubleshooting

### Common Issues

#### "Script cannot be loaded because running scripts is disabled"

**Solution:**
```powershell
# Current session only
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process

# Or permanent for current user
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### "WinGet is not recognized"

**Solution:**
```powershell
# Install App Installer from Microsoft Store
# Or use alternative:
./install.ps1 -SkipBootstrap
# Then select [M] to install Chocolatey or Scoop
```

#### "Kali tools fail on Ubuntu"

**Check:**
1. Repository added: `ls /etc/apt/sources.list.d/kali.list`
2. Pinning correct: `cat /etc/apt/preferences.d/kali-pinning`
3. Update cache: `sudo apt update`

#### "Real-time search not working"

**Requirements:**
- PowerShell 7.0+
- PSReadLine module: `Install-Module PSReadLine -Force`

### Log Locations

| Platform | Path |
|----------|------|
| Windows | `%USERPROFILE%\Documents\UltimateInstaller\` |
| macOS | `~/Library/Application Support/UltimateInstaller/` |
| Linux | `~/.ultimate_installer/` |

### Debug Mode

```powershell
# Verbose logging
./install.ps1 -Verbose

# Dry run (no actual changes)
./install.ps1 -DryRun

# Specific log file
./install.ps1 -LogFile "C:\debug.log"
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md).

### Quick Start for Contributors

```powershell
# Fork and clone
git clone https://github.com/yourusername/ultimate-installer.git
cd ultimate-installer

# Create branch
git checkout -b feature/amazing-feature

# Make changes, test
./install.ps1 -DryRun

# Commit
git commit -m "feat: add amazing feature"

# Push
git push origin feature/amazing-feature
```

### Adding New Applications

Edit the `$script:MasterApps` array in `install.ps1`:

```powershell
@{
    ID = "unique-id"
    Name = "Display Name"
    Category = "Category"
    WinIDs = @{ winget = "Publisher.App"; choco = "choco-id" }
    MacIDs = @{ brew = "brew-id"; cask = "cask-id" }
    LinuxIDs = @{ apt = "apt-id"; snap = "snap-id" }
    ConfigHooks = @("hook-name")
    Description = "Brief description"
}
```

---

## 📜 License

MIT License - see [LICENSE](LICENSE) file for details.

---

<p align="center">
  <b>Made with 💜 by the Ultimate Installer Team</b><br>
  <a href="https://github.com/yourusername/ultimate-installer/issues">Report Bug</a> •
  <a href="https://github.com/yourusername/ultimate-installer/discussions">Discussions</a> •
  <a href="https://github.com/yourusername/ultimate-installer/releases">Releases</a>
</p>
```
