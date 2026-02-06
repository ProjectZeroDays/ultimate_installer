#!/bin/bash
#
# Ultimate Installer - macOS Specific Installer
# Supports Intel (x64) and Apple Silicon (ARM64)

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Ultimate Installer for macOS${NC}"
echo "================================"

# Detect architecture
ARCH=$(uname -m)
case "$ARCH" in
    x86_64) 
        TARGET="macos-x64"
        echo "Detected: Intel Mac (x86_64)"
        ;;
    arm64) 
        TARGET="macos-arm64"
        echo "Detected: Apple Silicon (ARM64)"
        ;;
    *) 
        echo -e "${RED}Unsupported architecture: $ARCH${NC}"
        exit 1
        ;;
esac

# Check for Homebrew
if ! command -v brew &> /dev/null; then
    echo -e "${YELLOW}Homebrew not found. Installing...${NC}"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
brew install curl wget unzip 2>/dev/null || true

# Download binary
INSTALL_DIR="/usr/local/bin"
BINARY_NAME="ultimate-installer"
URL="https://github.com/ProjectZeroDays/ultimate_installer/releases/latest/download/ultimate-installer-${TARGET}"

echo -e "${BLUE}Downloading Ultimate Installer for ${TARGET}...${NC}"
curl -fsSL "$URL" -o "/tmp/${BINARY_NAME}"
chmod +x "/tmp/${BINARY_NAME}"

# Install
echo -e "${BLUE}Installing to ${INSTALL_DIR}...${NC}"
sudo mv "/tmp/${BINARY_NAME}" "${INSTALL_DIR}/${BINARY_NAME}"

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
