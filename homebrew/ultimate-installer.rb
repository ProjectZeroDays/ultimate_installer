class UltimateInstaller < Formula
  desc "Project Zero Days ultimate installer tool"
  homepage "https://github.com/ProjectZeroDays/ultimate_installer"
  url "https://raw.githubusercontent.com/ProjectZeroDays/ultimate_installer/refs/heads/Your-Momma-Beeotch/install.ps1"
  version "0.1.0"
  sha256 "PLACEHOLDER"  # You'll need to calculate this after finalizing your script

  # Since this is a PowerShell script, it requires pwsh on macOS/Linux
  depends_on "powershell" => :recommended

  def install
    # Install the PowerShell script
    libexec.install "install.ps1"
    
    # Create a wrapper script that calls pwsh
    (bin/"ultimate-installer").write <<~EOS
      #!/bin/bash
      exec pwsh "#{libexec}/install.ps1" "$@"
    EOS
    
    chmod 0755, bin/"ultimate-installer"
  end

  test do
    system "#{bin}/ultimate-installer", "--help" if system("which pwsh")
    # Or a simpler test if no --help flag exists:
    # assert_path_exists libexec/"install.ps1"
  end
end
