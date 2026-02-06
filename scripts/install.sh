#!/bin/bash
#
# Ultimate Installer - Unix Installation Script
# Supports Linux, macOS, BSD, Android (Termux), iOS (iSH)

set -euo pipefail

readonly SCRIPT_VERSION="1.0.0"
readonly SCRIPT_DATE="2025-02-06"
readonly MIN_BASH_VERSION="4.0"

VERSION="latest"
INSTALL_DIR="${HOME}/.local/share/ultimate-installer"
BIN_DIR="${HOME}/.local/bin"
MIRROR="https://github.com/ProjectZeroDays/ultimate_installer"
COMPONENTS=("core")
FORCE=false
NO_PATH=false
VERBOSE=false
DRY_RUN=false

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_step() { echo -e "${YELLOW}[STEP]${NC} $1"; }
log_success() { echo -e "${GREEN}[OK]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1" >&2; }
log_verbose() { [[ "$VERBOSE" == true ]] && echo -e "${MAGENTA}[VERBOSE]${NC} $1"; }
log_header() {
    echo ""
    echo -e "${CYAN}============================================================${NC}"
    echo -e "${CYAN}  $1${NC}"
    echo -e "${CYAN}============================================================${NC}"
}

show_help() {
    cat << EOF
Ultimate Installer - Unix Installation Script v$SCRIPT_VERSION

USAGE: ./install.sh [OPTIONS]

OPTIONS:
    -v, --version <ver>     Version to install (default: latest)
    -d, --dir <path>        Installation directory
    -b, --bin-dir <path>    Binary directory
    -c, --components <list> Comma-separated components
    -f, --force             Force reinstallation
    -n, --no-path           Don't add to PATH
    --dry-run               Show what would be installed
    --verbose               Enable verbose output
    -h, --help              Show this help

COMPONENTS: core, devtools, security, privacy, forensics, mobile-dev, embedded, network, all
EOF
}

parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -v|--version) VERSION="$2"; shift 2 ;;
            -d|--dir) INSTALL_DIR="$2"; shift 2 ;;
            -b|--bin-dir) BIN_DIR="$2"; shift 2 ;;
            -c|--components) IFS=',' read -ra COMPONENTS <<< "$2"; shift 2 ;;
            -f|--force) FORCE=true; shift ;;
            -n|--no-path) NO_PATH=true; shift ;;
            --dry-run) DRY_RUN=true; shift ;;
            --verbose) VERBOSE=true; shift ;;
            -h|--help) show_help; exit 0 ;;
            *) log_error "Unknown option: $1"; exit 1 ;;
        esac
    done
}

detect_platform() {
    log_step "Detecting platform..."

    local os arch distro package_manager is_mobile=false

    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        os="linux"
        if [[ -n "${TERMUX_VERSION:-}" ]]; then
            os="android"; distro="termux"; is_mobile=true
            INSTALL_DIR="/data/data/com.termux/files/usr/opt/ultimate-installer"
            BIN_DIR="/data/data/com.termux/files/usr/bin"
            package_manager="pkg"
        elif [[ -f "/proc/ish" ]]; then
            os="ios"; distro="ish"; is_mobile=true
            package_manager="apk"
        else
            if [[ -f /etc/os-release ]]; then
                source /etc/os-release
                distro="${ID,,}"
                case "$distro" in
                    ubuntu|debian|mint|pop|elementary|zorin|kali|parrot|kodachi) package_manager="apt" ;;
                    arch|manjaro|blackarch|garuda|endeavouros) package_manager="pacman" ;;
                    fedora|rhel|centos|rocky|alma) package_manager="dnf" ;;
                    alpine) package_manager="apk" ;;
                    void) package_manager="xbps" ;;
                    gentoo) package_manager="portage" ;;
                    nixos) package_manager="nix" ;;
                esac
            fi
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        os="macos"; distro="macos"; package_manager="brew"
    elif [[ "$OSTYPE" == "freebsd"* ]]; then
        os="freebsd"; distro="freebsd"; package_manager="pkg"
    elif [[ "$OSTYPE" == "openbsd"* ]]; then
        os="openbsd"; distro="openbsd"; package_manager="pkg_add"
    elif [[ "$OSTYPE" == "netbsd"* ]]; then
        os="netbsd"; distro="netbsd"; package_manager="pkgin"
    else
        log_error "Unsupported OS: $OSTYPE"; exit 1
    fi

    arch=$(uname -m)
    case "$arch" in
        x86_64|amd64) arch="x64" ;;
        aarch64|arm64) arch="arm64" ;;
        armv7l|armhf) arch="arm" ;;
        i386|i686) arch="x86" ;;
        *) log_error "Unsupported arch: $arch"; exit 1 ;;
    esac

    PLATFORM_OS="$os"
    PLATFORM_DISTRO="$distro"
    PLATFORM_ARCH="$arch"
    PLATFORM_PM="$package_manager"
    PLATFORM_MOBILE="$is_mobile"

    log_success "Platform: $distro ($arch)"
}

get_latest_version() {
    log_step "Fetching latest version..."
    local version=""
    if command -v curl &> /dev/null; then
        version=$(curl -fsSL -H "Accept: application/vnd.github.v3+json" "$MIRROR/releases/latest" 2>/dev/null | grep -oP '"tag_name": "\K[^"]+' || true)
    elif command -v wget &> /dev/null; then
        version=$(wget -qO- --header="Accept: application/vnd.github.v3+json" "$MIRROR/releases/latest" 2>/dev/null | grep -oP '"tag_name": "\K[^"]+' || true)
    fi
    echo "${version:-v0.1.0}"
}

download_binary() {
    local version="$1" arch="$2" os="$3"
    log_step "Downloading Ultimate Installer..."

    local filename="ultimate-installer-${os}-${arch}"
    local download_url="$MIRROR/releases/download/$version/$filename"
    [[ "$version" == "latest" ]] && download_url="$MIRROR/releases/latest/download/$filename"

    log_info "URL: $download_url"

    if [[ "$DRY_RUN" == true ]]; then
        log_info "[DRY RUN] Would download to: $INSTALL_DIR/$filename"
        return 0
    fi

    mkdir -p "$INSTALL_DIR" "$BIN_DIR"
    local output_path="$INSTALL_DIR/ultimate-installer"
    local temp_path="${output_path}.tmp"

    if command -v curl &> /dev/null; then
        curl -fsSL --progress-bar "$download_url" -o "$temp_path" || { log_error "Download failed"; return 1; }
    elif command -v wget &> /dev/null; then
        wget --progress=bar:force -O "$temp_path" "$download_url" || { log_error "Download failed"; return 1; }
    else
        log_error "curl or wget required"; exit 1
    fi

    chmod +x "$temp_path"
    mv "$temp_path" "$output_path"

    if [[ "$NO_PATH" == false ]]; then
        ln -sf "$output_path" "$BIN_DIR/ultimate-installer"
    fi

    log_success "Downloaded successfully"
    echo "$output_path"
}

install_components() {
    local binary_path="$1"
    log_header "Installing Components"

    [[ "${COMPONENTS[*]}" =~ "all" ]] && COMPONENTS=(core devtools security privacy forensics mobile-dev embedded network)
    log_info "Installing: ${COMPONENTS[*]}"

    [[ "$DRY_RUN" == true ]] && { log_info "[DRY RUN] Would install: ${COMPONENTS[*]}"; return 0; }

    for component in "${COMPONENTS[@]}"; do
        log_step "Installing: $component"
        local args=("install" "--module" "$component" "--yes")
        [[ "$VERBOSE" == true ]] && args+=("--verbose")
        "$binary_path" "${args[@]}" && log_success "$component installed" || log_error "$component failed"
    done
}

setup_shell() {
    log_step "Setting up shell..."
    [[ "$DRY_RUN" == true ]] && { log_info "[DRY RUN] Would configure shell"; return 0; }

    local shell_rc="${HOME}/.bashrc"
    [[ -n "${ZSH_VERSION:-}" ]] && shell_rc="${HOME}/.zshrc"

    if [[ "$NO_PATH" == false ]] && [[ ":$PATH:" != *":$BIN_DIR:"* ]]; then
        echo "export PATH="$BIN_DIR:\$PATH"" >> "$shell_rc"
        log_success "Updated PATH in $shell_rc"
    fi
}

show_summary() {
    local binary_path="$1"
    log_header "Installation Summary"
    echo -e "${WHITE}Directory:${NC} ${GREEN}$INSTALL_DIR${NC}"
    echo -e "${WHITE}Binary:${NC} ${GREEN}$binary_path${NC}"
    echo -e "${WHITE}Version:${NC} ${GREEN}$($binary_path version 2>/dev/null || echo 'unknown')${NC}"
    echo -e "${WHITE}Components:${NC} ${GREEN}${COMPONENTS[*]}${NC}"
    echo ""
    echo -e "${CYAN}Next steps:${NC}"
    echo "  1. source ~/.bashrc (or ~/.zshrc)"
    echo "  2. ultimate-installer --help"
    echo "  3. ultimate-installer doctor"
}

main() {
    parse_args "$@"
    log_header "Ultimate Installer Setup"
    detect_platform

    [[ "$VERSION" == "latest" ]] && VERSION=$(get_latest_version)

    local existing="$INSTALL_DIR/ultimate-installer"
    if [[ -f "$existing" ]] && [[ "$FORCE" == false ]] && [[ "$DRY_RUN" == false ]]; then
        log_info "Already installed: $($existing version 2>/dev/null || echo 'unknown')"
        read -rp "Reinstall? (y/N) " response
        [[ ! "$response" =~ ^[Yy]$ ]] && { log_info "Cancelled"; exit 0; }
    fi

    local binary
    binary=$(download_binary "$VERSION" "$PLATFORM_ARCH" "$PLATFORM_OS")
    [[ ${#COMPONENTS[@]} -gt 0 ]] && install_components "$binary"
    setup_shell
    show_summary "$binary"
    log_header "Complete!"
}

main "$@"
