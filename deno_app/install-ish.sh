#!/bin/sh
# Ultimate Installer for iSH (iOS)

set -e

echo "Installing Ultimate Installer on iSH..."

# Update repositories
apk update
apk add curl wget unzip

# Download Linux x64 binary (iSH emulates x86)
URL="https://github.com/ProjectZeroDays/ultimate_installer/releases/latest/download/ultimate-installer-ish"

echo "Downloading..."
curl -fsSL "$URL" -o "/usr/local/bin/ultimate-installer"
chmod +x "/usr/local/bin/ultimate-installer"

echo "Installation complete! Run 'ultimate-installer --help' to get started."
