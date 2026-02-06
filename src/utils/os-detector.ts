// src/utils/os-detector.ts
import { exec } from "https://deno.land/x/exec@0.0.5/mod.ts";
import type { OSDetails } from "../types/index.ts";

export class OSDetector {
  async detect(): Promise<OSDetails> {
    const details: OSDetails = {
      type: "Unknown",
      distro: "Unknown",
      version: "Unknown",
      build: "Unknown",
      architecture: Deno.build.arch,
      isServer: false,
      isWSL: false,
      isContainer: false,
      packageManagers: [],
      configPath: "",
      shell: "",
      desktopEnvironment: "Unknown",
      hasGUI: false,
      compatibility: [],
    };

    // Check for container
    try {
      const dockerenv = await Deno.stat("/.dockerenv");
      if (dockerenv) details.isContainer = true;
    } catch {
      // Not in container
    }

    // Detect OS type
    if (Deno.build.os === "windows") {
      details.type = "Windows";
      details.configPath = `${Deno.env.get("LOCALAPPDATA")}\\UltimateInstaller`;
      details.shell = "PowerShell";
      details.compatibility = ["Windows"];
      
      // Detect Windows version
      try {
        const { output } = await exec("powershell.exe -Command \"(Get-CimInstance Win32_OperatingSystem).Caption\"");
        details.version = output.trim();
        details.isServer = details.version.includes("Server");
        details.hasGUI = !details.isServer;
      } catch {
        // Fallback
      }
    } else if (Deno.build.os === "darwin") {
      details.type = "macOS";
      details.distro = "macOS";
      details.configPath = `${Deno.env.get("HOME")}/Library/Application Support/UltimateInstaller`;
      details.shell = "/bin/zsh";
      details.hasGUI = true;
      details.compatibility = ["macOS", "Darwin"];

      try {
        const { output: ver } = await exec("sw_vers -productVersion");
        details.version = ver.trim();
        const { output: build } = await exec("sw_vers -buildVersion");
        details.build = build.trim();
      } catch {
        // Fallback
      }
    } else if (Deno.build.os === "linux") {
      details.type = "Linux";
      details.configPath = `${Deno.env.get("HOME")}/.config/ultimate_installer`;
      details.shell = Deno.env.get("SHELL") || "/bin/bash";
      details.compatibility = ["Linux"];

      // Check for WSL
      try {
        const { output } = await exec("cat /proc/version");
        if (output.includes("microsoft") || output.includes("WSL")) {
          details.isWSL = true;
        }
      } catch {
        // Not WSL
      }

      // Parse os-release
      try {
        const osRelease = await Deno.readTextFile("/etc/os-release");
        const lines = osRelease.split("\n");
        const vars: Record<string, string> = {};
        
        for (const line of lines) {
          const match = line.match(/^(\w+)="?([^"]+)"?$/);
          if (match) vars[match[1]] = match[2];
        }

        details.distro = vars["ID"] || "Unknown";
        details.version = vars["VERSION_ID"] || "Unknown";
        details.build = vars["BUILD_ID"] || "Unknown";

        if (vars["ID_LIKE"]) {
          details.compatibility.push(...vars["ID_LIKE"].split(" "));
        }
        if (details.distro === "kali") details.compatibility.push("Kali");
        if (["ubuntu", "pop", "mint", "elementary", "zorin"].includes(details.distro)) {
          details.compatibility.push("Ubuntu");
        }

        // Check for GUI
        const de = Deno.env.get("XDG_CURRENT_DESKTOP");
        if (de) {
          details.desktopEnvironment = de;
          details.hasGUI = true;
        } else if (Deno.env.get("WAYLAND_DISPLAY") || Deno.env.get("DISPLAY")) {
          details.hasGUI = true;
        }
      } catch {
        // Fallback
      }
    }

    // Detect package managers
    details.packageManagers = await this.detectPackageManagers();

    return details;
  }

  private async detectPackageManagers(): Promise<string[]> {
    const managers: string[] = [];
    const checks = [
      { name: "winget", cmd: "winget --version", os: "windows" },
      { name: "choco", cmd: "choco --version", os: "windows" },
      { name: "scoop", cmd: "scoop --version", os: "windows" },
      { name: "brew", cmd: "brew --version", os: "darwin" },
      { name: "apt", cmd: "apt --version", os: "linux" },
      { name: "dnf", cmd: "dnf --version", os: "linux" },
      { name: "pacman", cmd: "pacman --version", os: "linux" },
      { name: "snap", cmd: "snap --version", os: "linux" },
      { name: "flatpak", cmd: "flatpak --version", os: "linux" },
    ];

    for (const check of checks) {
      if (check.os !== Deno.build.os && !(check.os === "linux" && Deno.build.os === "linux")) {
        continue;
      }
      try {
        await exec(check.cmd);
        managers.push(check.name);
      } catch {
        // Not installed
      }
    }

    return managers;
  }
}
