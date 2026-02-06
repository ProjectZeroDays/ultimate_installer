# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please report it to us as soon as possible.

### How to Report

**Email:** security@projectzerodays.com

**Please include:**
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Response Timeline

- **Acknowledgment**: Within 24 hours
- **Initial assessment**: Within 72 hours
- **Fix timeline**: Based on severity
  - Critical: 7 days
  - High: 14 days
  - Medium: 30 days
  - Low: 90 days

### Security Measures

- All releases are signed with GPG
- SHA256 checksums provided for all artifacts
- SBOM (Software Bill of Materials) generated for each release
- Automated dependency vulnerability scanning
- Static analysis in CI/CD pipeline

## Security Features

The Ultimate Installer includes several security-focused features:

- **Sandboxed Execution**: Installations run in isolated environments where possible
- **Checksum Verification**: All downloaded files are verified
- **Permission Management**: Proper handling of sudo/root permissions
- **Audit Logging**: All installation activities are logged
- **Minimal Privileges**: Runs with least required privileges

## Known Limitations

- Mobile platforms (Termux/iSH) may have limited sandboxing
- Some security tools require root privileges
- Network-based installations depend on external repository security
