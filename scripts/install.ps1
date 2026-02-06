# Ultimate Installer - PowerShell Installation Script
# Supports Windows 10/11, Windows Server 2019/2022
# Reference: https://raw.githubusercontent.com/ProjectZeroDays/ultimate_installer/main/install.ps1

param(
    [string]$Version = "latest",
    [string]$InstallDir = "$env:LOCALAPPDATA\ultimate-installer",
    [string]$Mirror = "https://github.com/ProjectZeroDays/ultimate_installer",
    [string[]]$Components = @("core"),
    [switch]$Force,
    [switch]$NoPath,
    [switch]$Verbose,
    [switch]$Help
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "Continue"

# Script metadata
$SCRIPT_VERSION = "1.0.0"
$SCRIPT_DATE = "2025-02-06"
$MIN_PS_VERSION = "5.1"
$MIN_OS_VERSION = "10.0.17763"  # Windows 10 1809

# Color codes for output
$Colors = @{
    Reset = "`e[0m"
    Red = "`e[31m"
    Green = "`e[32m"
    Yellow = "`e[33m"
    Blue = "`e[34m"
    Magenta = "`e[35m"
    Cyan = "`e[36m"
    White = "`e[37m"
    Bold = "`e[1m"
}

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White",
        [switch]$NoNewline
    )
    $colorCode = $Colors[$Color]
    $resetCode = $Colors.Reset
    if ($NoNewline) {
        Write-Host "${colorCode}${Message}${resetCode}" -NoNewline
    } else {
        Write-Host "${colorCode}${Message}${resetCode}"
    }
}

function Write-Header {
    param([string]$Title)
    Write-ColorOutput "" "White"
    Write-ColorOutput "=" * 60 "Cyan"
    Write-ColorOutput "  $Title" "Cyan"
    Write-ColorOutput "=" * 60 "Cyan"
}

function Write-Step {
    param([string]$Message)
    Write-ColorOutput "[STEP] $Message" "Yellow"
}

function Write-Success {
    param([string]$Message)
    Write-ColorOutput "[OK] $Message" "Green"
}

function Write-Error {
    param([string]$Message)
    Write-ColorOutput "[ERROR] $Message" "Red"
}

function Write-Info {
    param([string]$Message)
    Write-ColorOutput "[INFO] $Message" "Blue"
}

function Write-Verbose {
    param([string]$Message)
    if ($Verbose) {
        Write-ColorOutput "[VERBOSE] $Message" "Magenta"
    }
}

function Show-Help {
    @"
Ultimate Installer - PowerShell Installation Script
Version: $SCRIPT_VERSION

USAGE:
    .\install.ps1 [OPTIONS]

OPTIONS:
    -Version <string>      Version to install (default: latest)
    -InstallDir <path>     Installation directory (default: %LOCALAPPDATA%\ultimate-installer)
    -Mirror <url>          Custom mirror URL
    -Components <array>    Components to install (default: core)
    -Force                 Force reinstallation
    -NoPath                Don't add to PATH
    -Verbose               Enable verbose output
    -Help                  Show this help message

EXAMPLES:
    # Default installation
    .\install.ps1

    # Install specific version with devtools
    .\install.ps1 -Version "v1.2.0" -Components @("core", "devtools")

    # Install to custom directory
    .\install.ps1 -InstallDir "C:\Tools\ultimate-installer"

    # Force reinstall
    .\install.ps1 -Force

COMPONENTS:
    core           - Essential system tools
    devtools       - Development tools and languages
    security       - Security research tools
    privacy        - Privacy and anonymity tools
    network        - Network analysis tools
    all            - Install all components

SUPPORTED PLATFORMS:
    Windows 10 (1809+)
    Windows 11
    Windows Server 2019/2022
    Windows Subsystem for Linux (WSL)

For more information: https://github.com/ProjectZeroDays/ultimate_installer
"@ | Write-Output
}

function Test-AdminRights {
    $currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
    return $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Test-OSCompatibility {
    Write-Step "Checking operating system compatibility..."

    $osInfo = Get-CimInstance Win32_OperatingSystem
    $osVersion = [System.Version]$osInfo.Version
    $minVersion = [System.Version]$MIN_OS_VERSION

    Write-Verbose "OS Version: $($osInfo.Caption) $($osInfo.Version)"
    Write-Verbose "PS Version: $($PSVersionTable.PSVersion)"

    if ($PSVersionTable.PSVersion -lt [System.Version]$MIN_PS_VERSION) {
        throw "PowerShell $MIN_PS_VERSION or higher is required. Current version: $($PSVersionTable.PSVersion)"
    }

    if ($osVersion -lt $minVersion) {
        throw "Windows 10 version 1809 or higher is required. Current version: $osVersion"
    }

    # Check for Windows Server Core (no GUI)
    $isServerCore = (Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion" -Name InstallationType -ErrorAction SilentlyContinue).InstallationType -eq "Server Core"
    if ($isServerCore) {
        Write-Info "Windows Server Core detected - GUI components will be skipped"
    }

    # Check for WSL
    $wslInstalled = Test-Path "$env:SystemRoot\System32\wsl.exe"
    if ($wslInstalled) {
        Write-Info "Windows Subsystem for Linux detected"
    }

    Write-Success "OS compatibility check passed"
    return $true
}

function Get-Architecture {
    Write-Step "Detecting system architecture..."

    $arch = switch ($env:PROCESSOR_ARCHITECTURE) {
        "AMD64" { "x64" }
        "x86" { "x86" }
        "ARM64" { "arm64" }
        default { 
            Write-Error "Unsupported architecture: $env:PROCESSOR_ARCHITECTURE"
            exit 1
        }
    }

    Write-Verbose "Architecture: $arch"
    Write-Success "Architecture detected: $arch"
    return $arch
}

function Get-LatestVersion {
    Write-Step "Fetching latest version information..."

    try {
        $headers = @{
            "Accept" = "application/vnd.github.v3+json"
            "User-Agent" = "ultimate-installer-powershell"
        }

        $release = Invoke-RestMethod -Uri "$Mirror/releases/latest" -Headers $headers -TimeoutSec 30
        $version = $release.tag_name

        Write-Verbose "Latest version: $version"
        Write-Success "Latest version found: $version"
        return $version
    }
    catch {
        Write-Error "Failed to fetch latest version: $_"
        Write-Info "Falling back to default version"
        return "v0.1.0"
    }
}

function Get-DownloadUrl {
    param(
        [string]$Version,
        [string]$Arch
    )

    $fileName = "ultimate-installer-windows-$Arch.exe"

    if ($Version -eq "latest") {
        return "$Mirror/releases/latest/download/$fileName"
    } else {
        return "$Mirror/releases/download/$Version/$fileName"
    }
}

function Install-UltimateInstaller {
    param(
        [string]$Version,
        [string]$Arch
    )

    Write-Header "Installing Ultimate Installer"

    # Resolve version
    if ($Version -eq "latest") {
        $Version = Get-LatestVersion
    }

    # Create installation directory
    Write-Step "Creating installation directory..."
    if (-not (Test-Path $InstallDir)) {
        New-Item -ItemType Directory -Path $InstallDir -Force | Out-Null
    }

    $downloadUrl = Get-DownloadUrl -Version $Version -Arch $Arch
    $outputPath = Join-Path $InstallDir "ultimate-installer.exe"
    $tempPath = "$outputPath.tmp"

    Write-Info "Downloading from: $downloadUrl"
    Write-Info "Installing to: $outputPath"

    # Download with progress
    try {
        Write-Step "Downloading Ultimate Installer..."

        $webClient = New-Object System.Net.WebClient
        $webClient.Headers.Add("User-Agent", "ultimate-installer-powershell")

        # Progress callback
        $webClient.DownloadProgressChanged = {
            param($sender, $e)
            $percent = $e.ProgressPercentage
            $downloaded = [math]::Round($e.BytesReceived / 1MB, 2)
            $total = [math]::Round($e.TotalBytesToReceive / 1MB, 2)
            Write-Progress -Activity "Downloading Ultimate Installer" -Status "$downloaded MB / $total MB" -PercentComplete $percent
        }

        $webClient.DownloadFileAsync($downloadUrl, $tempPath)

        # Wait for download to complete
        while ($webClient.IsBusy) {
            Start-Sleep -Milliseconds 100
        }

        Write-Progress -Activity "Downloading Ultimate Installer" -Completed

        # Verify download
        if (-not (Test-Path $tempPath)) {
            throw "Download failed - file not found"
        }

        $fileSize = (Get-Item $tempPath).Length
        if ($fileSize -lt 1000) {
            throw "Download failed - file too small ($fileSize bytes)"
        }

        Write-Verbose "Downloaded file size: $fileSize bytes"

        # Replace old binary
        if (Test-Path $outputPath) {
            Remove-Item $outputPath -Force
        }
        Rename-Item $tempPath $outputPath -Force

        Write-Success "Download completed"
    }
    catch {
        Write-Error "Download failed: $_"
        if (Test-Path $tempPath) {
            Remove-Item $tempPath -Force -ErrorAction SilentlyContinue
        }
        exit 1
    }

    # Add to PATH
    if (-not $NoPath) {
        Write-Step "Adding to PATH..."

        $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
        if ($userPath -notlike "*$InstallDir*") {
            [Environment]::SetEnvironmentVariable("Path", "$userPath;$InstallDir", "User")
            Write-Success "Added to user PATH"
            Write-Info "Please restart your terminal or run 'refreshenv' to update PATH"
        } else {
            Write-Info "Already in PATH"
        }
    }

    # Create PowerShell profile integration
    Write-Step "Configuring PowerShell integration..."
    $profileDir = Split-Path $PROFILE -Parent
    if (-not (Test-Path $profileDir)) {
        New-Item -ItemType Directory -Path $profileDir -Force | Out-Null
    }

    $profileContent = @"
# Ultimate Installer Integration
`$env:UI_INSTALL_PATH = "$InstallDir"

# Tab completion
if (Get-Command ultimate-installer -ErrorAction SilentlyContinue) {
    ultimate-installer completions powershell | Out-String | Invoke-Expression
}
"@

    if (-not (Test-Path $PROFILE) -or (Get-Content $PROFILE -Raw) -notlike "*Ultimate Installer*") {
        Add-Content $PROFILE $profileContent
        Write-Success "PowerShell profile updated"
    }

    # Verify installation
    Write-Step "Verifying installation..."
    $versionOutput = & $outputPath version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Installation verified: $versionOutput"
    } else {
        Write-Error "Installation verification failed"
        exit 1
    }

    return $outputPath
}

function Install-Components {
    param([string]$BinaryPath)

    if ($Components -contains "all") {
        $Components = @("core", "devtools", "security", "privacy", "network")
    }

    Write-Header "Installing Components"
    Write-Info "Components to install: $($Components -join ', ')"

    foreach ($component in $Components) {
        Write-Step "Installing component: $component"

        $arguments = @(
            "install",
            "--module", $component,
            "--yes"
        )

        if ($Verbose) {
            $arguments += "--verbose"
        }

        try {
            & $BinaryPath @arguments
            if ($LASTEXITCODE -eq 0) {
                Write-Success "Component '$component' installed successfully"
            } else {
                Write-Error "Component '$component' installation failed with exit code $LASTEXITCODE"
            }
        }
        catch {
            Write-Error "Failed to install component '$component': $_"
        }
    }
}

function Install-Dependencies {
    Write-Header "Checking Dependencies"

    # Check for Windows Package Managers
    $packageManagers = @{
        "winget" = Get-Command winget -ErrorAction SilentlyContinue
        "choco" = Get-Command choco -ErrorAction SilentlyContinue
        "scoop" = Get-Command scoop -ErrorAction SilentlyContinue
    }

    $availablePM = $packageManagers.GetEnumerator() | Where-Object { $_.Value } | Select-Object -First 1

    if ($availablePM) {
        Write-Success "Package manager found: $($availablePM.Key)"
    } else {
        Write-Info "No package manager found. Installing winget..."

        # Try to install winget via Microsoft Store
        try {
            Start-Process "ms-windows-store://pdp/?ProductId=9NBLGGH4NNS1" -Wait
            Write-Info "Please install App Installer from Microsoft Store to get winget"
        }
        catch {
            Write-Info "Could not open Microsoft Store. Please install winget manually."
        }
    }

    # Check for WSL
    if (Test-Path "$env:SystemRoot\System32\wsl.exe") {
        Write-Success "WSL is available"
    }

    # Check for Windows Terminal
    $terminalPath = "$env:LOCALAPPDATA\Microsoft\WindowsApps\wt.exe"
    if (Test-Path $terminalPath) {
        Write-Success "Windows Terminal is available"
    }
}

function Show-Summary {
    param([string]$BinaryPath)

    Write-Header "Installation Summary"

    Write-ColorOutput "Installation Directory: " "White" -NoNewline
    Write-ColorOutput $InstallDir "Green"

    Write-ColorOutput "Binary Location: " "White" -NoNewline
    Write-ColorOutput $BinaryPath "Green"

    Write-ColorOutput "Version: " "White" -NoNewline
    $version = & $BinaryPath version 2>$null
    Write-ColorOutput $version "Green"

    if (-not $NoPath) {
        Write-ColorOutput "PATH Updated: " "White" -NoNewline
        Write-ColorOutput "Yes (restart terminal required)" "Yellow"
    }

    Write-ColorOutput "Components Installed: " "White" -NoNewline
    Write-ColorOutput ($Components -join ', ') "Green"

    Write-ColorOutput "" "White"
    Write-ColorOutput "Next steps:" "Cyan"
    Write-ColorOutput "  1. Restart your terminal or run 'refreshenv'" "White"
    Write-ColorOutput "  2. Run 'ultimate-installer --help' to get started" "White"
    Write-ColorOutput "  3. Run 'ultimate-installer doctor' to verify setup" "White"

    Write-ColorOutput "" "White"
    Write-ColorOutput "Documentation: https://github.com/ProjectZeroDays/ultimate_installer" "Blue"
    Write-ColorOutput "Support: https://github.com/ProjectZeroDays/ultimate_installer/issues" "Blue"
}

# Main execution
function Main {
    if ($Help) {
        Show-Help
        exit 0
    }

    Write-Header "Ultimate Installer Setup"
    Write-ColorOutput "Version: $SCRIPT_VERSION" "Blue"
    Write-ColorOutput "PowerShell Version: $($PSVersionTable.PSVersion)" "Blue"
    Write-ColorOutput "" "White"

    # Check admin rights (not required but recommended)
    if (Test-AdminRights) {
        Write-Info "Running with administrator privileges"
    } else {
        Write-Info "Running without administrator privileges (some features may be limited)"
    }

    # Pre-flight checks
    Test-OSCompatibility
    $arch = Get-Architecture
    Install-Dependencies

    # Check existing installation
    $existingBinary = Join-Path $InstallDir "ultimate-installer.exe"
    if ((Test-Path $existingBinary) -and (-not $Force)) {
        Write-Info "Ultimate Installer is already installed"
        $currentVersion = & $existingBinary version 2>$null
        Write-Info "Current version: $currentVersion"

        $response = Read-Host "Do you want to reinstall/upgrade? (y/N)"
        if ($response -notmatch "^[Yy]$") {
            Write-Info "Installation cancelled"
            exit 0
        }
    }

    # Install
    $binary = Install-UltimateInstaller -Version $Version -Arch $arch

    # Install components
    if ($Components.Count -gt 0 -and $Components[0] -ne "") {
        Install-Components -BinaryPath $binary
    }

    # Show summary
    Show-Summary -BinaryPath $binary

    Write-Header "Installation Complete!"
}

# Run main function
Main
