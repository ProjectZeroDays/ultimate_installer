#!/bin/bash
#
# Ultimate Installer - ARM Linux Installer
# Supports ARM64 (aarch64) and ARMv7 (armhf)

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Ultimate Installer for ARM Linux${NC}"
echo "=================================="

# Detect ARM architecture
ARCH=$(uname -m)
case "$ARCH" in
    aarch64|arm64)
        TARGET="linux-arm64"
        echo "Detected: ARM64 (aarch64)"
        ;;
    armv7l|armv6l|armhf)
        TARGET="linux-arm"
        echo "Detected: ARM32 (${ARCH})"
        ;;
    *)
        echo -e "${RED}Unsupported architecture: $ARCH${NC}"
        exit 1
        ;;
esac

# Detect distribution
if [[ -f /etc/os-release ]]; then
    source /etc/os-release
    DISTRO="${ID,,}"
    echo "Distribution: ${NAME}"
else
    echo -e "${RED}Cannot detect distribution${NC}"
    exit 1
fi

# Install dependencies based on distro
echo -e "${BLUE}Installing dependencies...${NC}"
case "$DISTRO" in
    ubuntu|debian|raspbian|kali|parrot)
        sudo apt-get update
        sudo apt-get install -y curl wget unzip
        ;;
    alpine)
        sudo apk add --no-cache curl wget unzip
        ;;
    arch|manjaro)
        sudo pacman -Sy --noconfirm curl wget unzip
        ;;
    fedora)
        sudo dnf install -y curl wget unzip
        ;;
    *)
        echo -e "${YELLOW}Unknown distribution, assuming curl/wget/unzip are installed${NC}"
        ;;
esac

# Download binary
INSTALL_DIR="/usr/local/bin"
BINARY_NAME="ultimate-installer"
URL="https://github.com/ProjectZeroDays/ultimate_installer/releases/latest/download/ultimate-installer-${TARGET}"

echo -e "${BLUE}Downloading Ultimate Installer for ${TARGET}...${NC}"
sudo curl -fsSL "$URL" -o "${INSTALL_DIR}/${BINARY_NAME}"
sudo chmod +x "${INSTALL_DIR}/${BINARY_NAME}"

# Verify
if command -v ultimate-installer &> /dev/null; then
    echo -e "${GREEN}✓ Installation successful!${NC}"
    ultimate-installer version
else
    echo -e "${RED}Installation failed${NC}"
    exit 1
fi

echo ""
echo "Next steps:"
echo "  ultimate-installer --help"
echo "  ultimate-installer install"
