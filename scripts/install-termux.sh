#!/bin/bash
# Ultimate Installer for Termux (Android)

set -e

echo "Installing Ultimate Installer on Termux..."

# Install dependencies
pkg update -y
pkg install -y curl wget unzip

# Download appropriate binary
ARCH=$(uname -m)
case $ARCH in
  aarch64) BINARY="ultimate-installer-android" ;;
  armv7l)  BINARY="ultimate-installer-linux-arm" ;;
  x86_64)  BINARY="ultimate-installer-linux-x64" ;;
  *)       echo "Unsupported architecture: $ARCH"; exit 1 ;;
esac

URL="https://github.com/ProjectZeroDays/ultimate_installer/releases/latest/download/${BINARY}"

echo "Downloading ${BINARY}..."
curl -fsSL "$URL" -o "$PREFIX/bin/ultimate-installer"
chmod +x "$PREFIX/bin/ultimate-installer"

echo "Installation complete! Run 'ultimate-installer --help' to get started."
