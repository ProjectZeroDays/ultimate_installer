# Installation Scripts

This directory contains platform-specific installation scripts for Ultimate Installer.

## Quick Reference

| Platform | Script | Command |
|----------|--------|---------|
| **Universal** | `install.sh` | `curl \| bash` |
| **Windows** | `install.ps1` | `Invoke-WebRequest \| iex` |
| **macOS** | `install-macos.sh` | `curl \| bash` |
| **ARM Linux** | `install-arm.sh` | `curl \| bash` |
| **Raspberry Pi** | `install-raspberrypi.sh` | `curl \| bash` |
| **Android** | `install-termux.sh` | `curl \| bash` |
| **iOS** | `install-ish.sh` | `curl \| sh` |

## Available Scripts

### Core Installers

| Script | Platform | Architectures | Description |
|--------|----------|---------------|-------------|
| `install.sh` | Universal Unix | x64, ARM64, ARM, x86 | Auto-detects OS, distro, and architecture |
| `install.ps1` | Windows | x64, ARM64 | PowerShell installer with admin detection |

### Specialized Installers

| Script | Platform | Specific For |
|--------|----------|--------------|
| `install-macos.sh` | macOS | Intel & Apple Silicon Macs |
| `install-arm.sh` | Linux | ARM64 & ARMv7 devices |
| `install-raspberrypi.sh` | Raspberry Pi | Pi OS with GPIO tools |
| `install-termux.sh` | Android | Termux environment |
| `install-ish.sh` | iOS | iSH shell |

### Development Scripts

| Script | Purpose |
|--------|---------|
| `build-all.sh` | Build all platform binaries |
| `release.sh` | Create release with artifacts |
| `bump-version.ts` | Bump version numbers |
| `generate-docs.ts` | Generate documentation |
| `generate-json-schema.ts` | Generate JSON schemas |

## Usage Examples

### Universal Installer (Recommended)

Works on most Unix-like systems (Linux, macOS, BSD):

```bash
curl -fsSL https://raw.githubusercontent.com/ProjectZeroDays/ultimate_installer/main/scripts/install.sh | bash
```

**What it detects automatically:**
- OS: Linux, macOS, FreeBSD, OpenBSD, NetBSD
- Distribution: Ubuntu, Debian, Arch, Fedora, etc.
- Architecture: x64, ARM64, ARM, x86
- Mobile: Termux (Android), iSH (iOS)

### Platform-Specific Installers

#### macOS (Intel & Apple Silicon)

```bash
curl -fsSL https://raw.githubusercontent.com/ProjectZeroDays/ultimate_installer/main/scripts/install-macos.sh | bash
```

**Features:**
- Auto-detects Intel vs Apple Silicon
- Installs Homebrew if missing
- Optimized for macOS filesystem

#### ARM Devices (ARM64/ARMv7)

```bash
curl -fsSL https://raw.githubusercontent.com/ProjectZeroDays/ultimate_installer/main/scripts/install-arm.sh | bash
```

**Supports:**
- ARM64 (aarch64) servers and devices
- ARMv7 (armhf) boards
- NVIDIA Jetson
- AWS Graviton
- Apple Silicon Linux VMs

#### Raspberry Pi

```bash
curl -fsSL https://raw.githubusercontent.com/ProjectZeroDays/ultimate_installer/main/scripts/install-raspberrypi.sh | bash
```

**Includes:**
- GPIO tools (python3-gpiozero)
- I2C/SPI/Serial interface setup
- Raspberry Pi OS optimizations

#### Windows

```powershell
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/ProjectZeroDays/ultimate_installer/main/scripts/install.ps1" -UseBasicParsing | Invoke-Expression
```

**Features:**
- Administrator privilege detection
- Windows version compatibility check
- PATH configuration
- PowerShell profile integration

#### Android (Termux)

```bash
curl -fsSL https://raw.githubusercontent.com/ProjectZeroDays/ultimate_installer/main/scripts/install-termux.sh | bash
```

**Handles:**
- Architecture detection (ARM64/ARM/x86_64)
- Termux $PREFIX paths
- Android API compatibility

#### iOS (iSH)

```bash
curl -fsSL https://raw.githubusercontent.com/ProjectZeroDays/ultimate_installer/main/scripts/install-ish.sh | sh
```

**Features:**
- Alpine Linux compatibility
- x86 emulation support
- Minimal dependencies

## Architecture Support Matrix

| Architecture | install.sh | install-macos.sh | install-arm.sh | install-raspberrypi.sh |
|-------------|------------|------------------|----------------|------------------------|
| x86_64 (Intel/AMD) | ✅ | ✅ | ❌ | ❌ |
| ARM64 (Apple Silicon) | ✅ | ✅ | ✅ | ✅ |
| ARM64 (ARMv8) | ✅ | ❌ | ✅ | ✅ |
| ARMv7 (ARM32) | ✅ | ❌ | ✅ | ✅ |
| x86 (32-bit) | ✅ | ❌ | ❌ | ❌ |

## Binary Downloads

Each script downloads the appropriate binary from GitHub Releases:

| Binary | Platform | Architecture |
|--------|----------|--------------|
| `ultimate-installer-linux-x64` | Linux | x86_64 |
| `ultimate-installer-linux-arm64` | Linux | ARM64 |
| `ultimate-installer-linux-arm` | Linux | ARMv7 |
| `ultimate-installer-macos-x64` | macOS | x86_64 |
| `ultimate-installer-macos-arm64` | macOS | ARM64 |
| `ultimate-installer-windows-x64.exe` | Windows | x86_64 |
| `ultimate-installer-freebsd` | FreeBSD | x86_64 |
| `ultimate-installer-android` | Android | ARM64 |
| `ultimate-installer-ish` | iOS | x86_64 (emulated) |

## Local Execution

```bash
# Clone repository
git clone https://github.com/ProjectZeroDays/ultimate_installer.git
cd ultimate_installer

# Run specific script
./scripts/install.sh
./scripts/install-macos.sh
./scripts/install-arm.sh
./scripts/install-raspberrypi.sh
./scripts/install-termux.sh
./scripts/install-ish.sh
```

## Troubleshooting

### Permission Denied

```bash
chmod +x scripts/install.sh
./scripts/install.sh
```

### curl not found

```bash
wget -qO- https://raw.githubusercontent.com/ProjectZeroDays/ultimate_installer/main/scripts/install.sh | bash
```

### Behind Proxy

```bash
export https_proxy=http://proxy:port
curl -fsSL ... | bash
```

### Specific Version

```bash
curl -fsSL https://raw.githubusercontent.com/ProjectZeroDays/ultimate_installer/main/scripts/install.sh | bash -s -- --version v1.2.0
```
