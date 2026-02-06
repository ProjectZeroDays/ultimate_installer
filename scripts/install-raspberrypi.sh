#!/bin/bash
#
# Ultimate Installer - Raspberry Pi Optimized Installer
# Optimized for Raspbian/Raspberry Pi OS

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Ultimate Installer for Raspberry Pi${NC}"
echo "====================================="

# Check if running on Raspberry Pi
if [[ -f /proc/device-tree/model ]]; then
    MODEL=$(cat /proc/device-tree/model)
    echo "Device: $MODEL"
else
    echo -e "${YELLOW}Warning: May not be running on Raspberry Pi${NC}"
fi

# Detect architecture
ARCH=$(uname -m)
case "$ARCH" in
    aarch64)
        TARGET="linux-arm64"
        echo "Architecture: ARM64 (aarch64)"
        ;;
    armv7l)
        TARGET="linux-arm"
        echo "Architecture: ARMv7 (32-bit)"
        ;;
    *)
        echo -e "${RED}Unsupported architecture: $ARCH${NC}"
        exit 1
        ;;
esac

# Update and install dependencies
echo -e "${BLUE}Updating package lists...${NC}"
sudo apt-get update

echo -e "${BLUE}Installing dependencies...${NC}"
sudo apt-get install -y curl wget unzip git

# Download and install
INSTALL_DIR="/usr/local/bin"
BINARY_NAME="ultimate-installer"
URL="https://github.com/ProjectZeroDays/ultimate_installer/releases/latest/download/ultimate-installer-${TARGET}"

echo -e "${BLUE}Downloading Ultimate Installer...${NC}"
sudo curl -fsSL "$URL" -o "${INSTALL_DIR}/${BINARY_NAME}"
sudo chmod +x "${INSTALL_DIR}/${BINARY_NAME}"

# Install additional Pi-specific tools
echo -e "${BLUE}Installing Raspberry Pi tools...${NC}"
sudo apt-get install -y     python3-gpiozero     python3-pigpio     i2c-tools     spi-tools     2>/dev/null || true

# Enable interfaces
echo -e "${BLUE}Enabling hardware interfaces...${NC}"
sudo raspi-config nonint do_i2c 0 2>/dev/null || true
sudo raspi-config nonint do_spi 0 2>/dev/null || true
sudo raspi-config nonint do_serial 0 2>/dev/null || true

# Verify
if command -v ultimate-installer &> /dev/null; then
    echo -e "${GREEN}✓ Installation successful!${NC}"
    ultimate-installer version
else
    echo -e "${RED}Installation failed${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}Raspberry Pi setup complete!${NC}"
echo ""
echo "Next steps:"
echo "  ultimate-installer install --module embedded"
echo "  ultimate-installer install --module devtools"
