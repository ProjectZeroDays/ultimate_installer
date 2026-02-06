# Installation Guide

Complete guide for installing Ultimate Installer on all supported platforms.

## Table of Contents

- [Quick Install](#quick-install)
- [Desktop Systems](#desktop-systems)
  - [Linux](#linux)
  - [macOS](#macos)
  - [Windows](#windows)
- [Mobile Devices](#mobile-devices)
  - [Android](#android-termux)
  - [iOS](#ios-ish)
- [ARM Devices](#arm-devices)
  - [Raspberry Pi](#raspberry-pi)
  - [ARM Servers](#arm-servers)
- [Embedded Systems](#embedded-systems)
- [BSD Systems](#bsd-systems)

## Quick Install

### One-Liner Installers

**Linux/macOS/BSD:**
```bash
curl -fsSL https://raw.githubusercontent.com/ProjectZeroDays/ultimate_installer/main/scripts/install.sh | bash
```

**Windows:**
```powershell
iwr -useb https://raw.githubusercontent.com/ProjectZeroDays/ultimate_installer/main/scripts/install.ps1 | iex
```

**Android (Termux):**
```bash
curl -fsSL https://raw.githubusercontent.com/ProjectZeroDays/ultimate_installer/main/scripts/install-termux.sh | bash
```

**iOS (iSH):**
```bash
curl -fsSL https://raw.githubusercontent.com/ProjectZeroDays/ultimate_installer/main/scripts/install-ish.sh | sh
```

## Desktop Systems

### Linux

#### Ubuntu/Debian

```bash
# Method 1: Universal installer
curl -fsSL https://raw.githubusercontent.com/ProjectZeroDays/ultimate_installer/main/scripts/install.sh | bash

# Method 2: Using apt (when available)
sudo apt update
sudo apt install -y curl
sudo curl -fsSL https://.../ultimate-installer-linux-x64 -o /usr/local/bin/ultimate-installer
sudo chmod +x /usr/local/bin/ultimate-installer
```

#### Arch Linux

```bash
# Using universal installer
curl -fsSL https://raw.githubusercontent.com/ProjectZeroDays/ultimate_installer/main/scripts/install.sh | bash

# Or using yay/paru (when AUR package available)
yay -S ultimate-installer
```

#### Fedora/RHEL

```bash
# Universal installer works on all RPM-based distros
curl -fsSL https://raw.githubusercontent.com/ProjectZeroDays/ultimate_installer/main/scripts/install.sh | bash
```

#### Alpine Linux

```bash
# Install dependencies first
apk add --no-cache curl bash

# Run installer
curl -fsSL https://raw.githubusercontent.com/ProjectZeroDays/ultimate_installer/main/scripts/install.sh | bash
```

### macOS

#### Intel Mac (x64)

```bash
# Option 1: macOS-specific installer
curl -fsSL https://raw.githubusercontent.com/ProjectZeroDays/ultimate_installer/main/scripts/install-macos.sh | bash

# Option 2: Universal installer
curl -fsSL https://raw.githubusercontent.com/ProjectZeroDays/ultimate_installer/main/scripts/install.sh | bash

# Option 3: Homebrew (when available)
brew install ultimate-installer
```

#### Apple Silicon (M1/M2/M3)

```bash
# macOS-specific installer auto-detects Apple Silicon
curl -fsSL https://raw.githubusercontent.com/ProjectZeroDays/ultimate_installer/main/scripts/install-macos.sh | bash

# Downloads: ultimate-installer-macos-arm64
```

### Windows

#### Windows 10/11

```powershell
# Method 1: PowerShell installer
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/ProjectZeroDays/ultimate_installer/main/scripts/install.ps1" -UseBasicParsing | Invoke-Expression

# Method 2: Manual download
# Download ultimate-installer-windows-x64.exe from Releases
# Add to PATH manually or run installer
```

#### Windows Server

```powershell
# Same as Windows 10/11
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/ProjectZeroDays/ultimate_installer/main/scripts/install.ps1" -UseBasicParsing | Invoke-Expression
```

## Mobile Devices

### Android (Termux)

**Requirements:**
- Android 7.0+
- Termux app (F-Droid version recommended)

**Installation:**
```bash
# In Termux terminal
curl -fsSL https://raw.githubusercontent.com/ProjectZeroDays/ultimate_installer/main/scripts/install-termux.sh | bash

# Or manually:
pkg update
pkg install -y curl wget unzip
ARCH=$(uname -m)
case $ARCH in
  aarch64) curl -fsSL https://github.com/ProjectZeroDays/ultimate_installer/releases/latest/download/ultimate-installer-android -o $PREFIX/bin/ultimate-installer ;;
  armv7l) curl -fsSL https://github.com/ProjectZeroDays/ultimate_installer/releases/latest/download/ultimate-installer-linux-arm -o $PREFIX/bin/ultimate-installer ;;
  x86_64) curl -fsSL https://github.com/ProjectZeroDays/ultimate_installer/releases/latest/download/ultimate-installer-linux-x64 -o $PREFIX/bin/ultimate-installer ;;
esac
chmod +x $PREFIX/bin/ultimate-installer
```

### iOS (iSH)

**Requirements:**
- iOS 12.0+
- iSH app from App Store

**Installation:**
```bash
# In iSH terminal
curl -fsSL https://raw.githubusercontent.com/ProjectZeroDays/ultimate_installer/main/scripts/install-ish.sh | sh

# Or manually:
apk add curl wget unzip
curl -fsSL https://github.com/ProjectZeroDays/ultimate_installer/releases/latest/download/ultimate-installer-ish -o /usr/local/bin/ultimate-installer
chmod +x /usr/local/bin/ultimate-installer
```

## ARM Devices

### Raspberry Pi

**Raspberry Pi OS (32-bit):**
```bash
curl -fsSL https://raw.githubusercontent.com/ProjectZeroDays/ultimate_installer/main/scripts/install-raspberrypi.sh | bash
```

**Raspberry Pi OS (64-bit):**
```bash
curl -fsSL https://raw.githubusercontent.com/ProjectZeroDays/ultimate_installer/main/scripts/install-raspberrypi.sh | bash
# Downloads ARM64 binary
```

**Ubuntu Server for Pi:**
```bash
curl -fsSL https://raw.githubusercontent.com/ProjectZeroDays/ultimate_installer/main/scripts/install-arm.sh | bash
```

### ARM Servers

**AWS Graviton:**
```bash
# Amazon Linux 2/RHEL/Fedora
curl -fsSL https://raw.githubusercontent.com/ProjectZeroDays/ultimate_installer/main/scripts/install-arm.sh | bash
```

**Oracle Cloud (Ampere):**
```bash
# Ubuntu/Oracle Linux
curl -fsSL https://raw.githubusercontent.com/ProjectZeroDays/ultimate_installer/main/scripts/install-arm.sh | bash
```

**Azure (ARM64):**
```bash
# Ubuntu/CentOS on ARM64
curl -fsSL https://raw.githubusercontent.com/ProjectZeroDays/ultimate_installer/main/scripts/install-arm.sh | bash
```

### Other ARM Boards

**NVIDIA Jetson:**
```bash
# Jetson Nano, TX2, Xavier, Orin
curl -fsSL https://raw.githubusercontent.com/ProjectZeroDays/ultimate_installer/main/scripts/install-arm.sh | bash
```

**Orange Pi / Banana Pi:**
```bash
# Armbian or similar
curl -fsSL https://raw.githubusercontent.com/ProjectZeroDays/ultimate_installer/main/scripts/install-arm.sh | bash
```

## Embedded Systems

### OpenWrt

```bash
# Download statically linked binary
wget https://github.com/ProjectZeroDays/ultimate_installer/releases/latest/download/ultimate-installer-linux-arm64
chmod +x ultimate-installer-linux-arm64
mv ultimate-installer-linux-arm64 /usr/bin/ultimate-installer
```

## BSD Systems

### FreeBSD

```bash
# Install dependencies
pkg install -y curl wget unzip

# Run universal installer
curl -fsSL https://raw.githubusercontent.com/ProjectZeroDays/ultimate_installer/main/scripts/install.sh | bash
```

### OpenBSD

```bash
pkg_add curl wget unzip
curl -fsSL https://raw.githubusercontent.com/ProjectZeroDays/ultimate_installer/main/scripts/install.sh | bash
```

### NetBSD

```bash
pkgin install curl wget unzip
curl -fsSL https://raw.githubusercontent.com/ProjectZeroDays/ultimate_installer/main/scripts/install.sh | bash
```

## Post-Installation

After installation, verify it works:

```bash
# Check version
ultimate-installer version

# Show help
ultimate-installer --help

# Run system diagnostics
ultimate-installer doctor

# Install default components
ultimate-installer install
```

## Troubleshooting

### "command not found"

```bash
# Add to PATH
export PATH="$HOME/.local/bin:$PATH"

# Or for system-wide
sudo ln -sf ~/.local/share/ultimate-installer/ultimate-installer /usr/local/bin/
```

### Permission denied

```bash
chmod +x /path/to/ultimate-installer
```

### Architecture mismatch

```bash
# Check your architecture
uname -m

# Download correct binary manually
# x86_64 → ultimate-installer-linux-x64
# aarch64 → ultimate-installer-linux-arm64
# armv7l → ultimate-installer-linux-arm
```

## Uninstallation

```bash
# Remove binary
rm ~/.local/bin/ultimate-installer
rm ~/.local/share/ultimate-installer/ultimate-installer

# Remove config
rm -rf ~/.config/ultimate-installer

# Or use the tool itself
ultimate-installer uninstall --all
```
