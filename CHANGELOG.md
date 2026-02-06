# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial release of Ultimate Installer
- Support for 50+ platforms including Linux, macOS, Windows, BSD, Android, iOS
- Modular installation system (core, devtools, security, privacy, forensics, mobile-dev, embedded, network)
- Cross-platform binary compilation via Deno
- Automated CI/CD with GitHub Actions
- Auto-approve and auto-merge workflows
- Dependency update automation
- Security scanning and vulnerability detection
- Shell completion support
- Comprehensive documentation

### Features
- **Platform Detection**: Automatic OS, distribution, and architecture detection
- **Package Manager Abstraction**: Unified interface for apt, dnf, pacman, apk, pkg, etc.
- **Mobile Support**: Full Termux (Android) and iSH (iOS) integration
- **Security Tools**: Network scanning, vulnerability assessment, wireless security, exploitation frameworks
- **Privacy Tools**: Tor, I2P, encryption utilities
- **Forensics Suite**: Digital forensics and incident response tools
- **Embedded Development**: PlatformIO, Arduino CLI, IoT tools

## [0.1.0] - 2025-02-06

### Added
- Initial release
- Basic CLI structure with install, uninstall, list, update commands
- Platform detection for major Linux distributions
- Core module with essential tools
- Development tools module
- Security research module

[Unreleased]: https://github.com/ProjectZeroDays/ultimate_installer/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/ProjectZeroDays/ultimate_installer/releases/tag/v0.1.0
