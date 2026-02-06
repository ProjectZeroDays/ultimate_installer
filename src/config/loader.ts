// src/config/loader.ts
import { parse as parseYaml } from "https://deno.land/std@0.208.0/yaml/mod.ts";
import { parse as parseJsonc } from "https://deno.land/std@0.208.0/jsonc/mod.ts";
import { exists } from "https://deno.land/std@0.208.0/fs/mod.ts";
import { join, dirname } from "https://deno.land/std@0.208.0/path/mod.ts";

export interface ConfigProfile {
  name: string;
  description: string;
  settings: Record<string, unknown>;
  apps: string[];
  hooks: string[];
}

export interface UserSettings {
  version: string;
  lastUpdated: string;
  autoCheckUpdates: boolean;
  updateCheckIntervalHours: number;
  skipUpdatePrompts: boolean;
  defaultProfile: string;
  autoConfigure: boolean;
  backupBeforeInstall: boolean;
  enableRealtimeSearch: boolean;
  searchDelayMs: number;
  showDescriptions: boolean;
  colorScheme: string;
  confirmOSDetection: boolean;
  enablePrivacyMode: boolean;
  kodachiMode: boolean;
  kaliToolsOnUbuntu: boolean;
  autoHarden: boolean;
  parallelInstalls: number;
  timeoutMinutes: number;
  retryFailed: boolean;
  backupLocation: string;
  customRepos: string[];
  excludedApps: string[];
}

export const DEFAULT_SETTINGS: UserSettings = {
  version: "5.0",
  lastUpdated: new Date().toISOString().split("T")[0],
  autoCheckUpdates: true,
  updateCheckIntervalHours: 24,
  skipUpdatePrompts: false,
  defaultProfile: "Default",
  autoConfigure: true,
  backupBeforeInstall: true,
  enableRealtimeSearch: true,
  searchDelayMs: 150,
  showDescriptions: true,
  colorScheme: "Default",
  confirmOSDetection: true,
  enablePrivacyMode: false,
  kodachiMode: false,
  kaliToolsOnUbuntu: false,
  autoHarden: false,
  parallelInstalls: 1,
  timeoutMinutes: 30,
  retryFailed: true,
  backupLocation: "",
  customRepos: [],
  excludedApps: [],
};

export const DEFAULT_PROFILES: Record<string, ConfigProfile> = {
  Default: {
    name: "Default",
    description: "Safe defaults for general use",
    settings: {},
    apps: ["git", "code", "nodejs", "python3"],
    hooks: ["git-config"],
  },
  Developer: {
    name: "Developer",
    description: "Full-stack development environment",
    settings: {
      git: { default_branch: "main", core_editor: "code --wait" },
      vscode: { extensions: ["ms-vscode.vscode-typescript-next", "esbenp.prettier-vscode"] },
    },
    apps: ["git", "code", "nodejs", "python3", "docker", "gh_cli", "powershell7"],
    hooks: ["git-config", "code-extensions", "ps7-modules"],
  },
  Cybersecurity: {
    name: "Cybersecurity",
    description: "Penetration testing and security tools",
    settings: {},
    apps: ["nmap", "wireshark", "metasploit", "burp_suite", "kali_wsl"],
    hooks: [],
  },
  "AI/ML": {
    name: "AI/ML Engineer",
    description: "Machine learning and AI development",
    settings: {
      ollama: { default_models: ["llama3.2", "codellama", "mistral"] },
    },
    apps: ["ollama", "python3", "anaconda", "docker", "vscode"],
    hooks: ["ollama-models"],
  },
  Minimal: {
    name: "Minimal",
    description: "Essential CLI tools only",
    settings: {},
    apps: ["git", "fzf", "ripgrep", "bat", "eza"],
    hooks: [],
  },
};

export class ConfigLoader {
  private configDir: string;
  private settingsFile: string;
  private profilesDir: string;

  constructor(baseDir: string = Deno.cwd()) {
    this.configDir = join(baseDir, ".config");
    this.settingsFile = join(this.configDir, "settings.json");
    this.profilesDir = join(this.configDir, "profiles");
  }

  async initialize(): Promise<void> {
    // Create config directories if they don't exist
    await Deno.mkdir(this.configDir, { recursive: true });
    await Deno.mkdir(this.profilesDir, { recursive: true });

    // Create default settings if not exists
    if (!await exists(this.settingsFile)) {
      await this.saveSettings(DEFAULT_SETTINGS);
    }

    // Create default profiles if not exists
    for (const [name, profile] of Object.entries(DEFAULT_PROFILES)) {
      const profilePath = join(this.profilesDir, `${name.toLowerCase().replace(/\//g, "-")}.json`);
      if (!await exists(profilePath)) {
        await Deno.writeTextFile(profilePath, JSON.stringify(profile, null, 2));
      }
    }
  }

  async loadSettings(): Promise<UserSettings> {
    try {
      if (!await exists(this.settingsFile)) {
        return { ...DEFAULT_SETTINGS };
      }

      const content = await Deno.readTextFile(this.settingsFile);
      const parsed = JSON.parse(content);
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch (error) {
      console.warn("Failed to load settings, using defaults:", error);
      return { ...DEFAULT_SETTINGS };
    }
  }

  async saveSettings(settings: UserSettings): Promise<void> {
    const updated = {
      ...settings,
      lastUpdated: new Date().toISOString().split("T")[0],
    };
    await Deno.writeTextFile(this.settingsFile, JSON.stringify(updated, null, 2));
  }

  async loadProfile(name: string): Promise<ConfigProfile | null> {
    try {
      const profilePath = join(this.profilesDir, `${name.toLowerCase().replace(/\//g, "-")}.json`);
      
      if (!await exists(profilePath)) {
        // Check built-in profiles
        const builtIn = DEFAULT_PROFILES[name];
        if (builtIn) return builtIn;
        return null;
      }

      const content = await Deno.readTextFile(profilePath);
      return JSON.parse(content) as ConfigProfile;
    } catch (error) {
      console.warn(`Failed to load profile "${name}":`, error);
      return null;
    }
  }

  async saveProfile(name: string, profile: ConfigProfile): Promise<void> {
    const profilePath = join(this.profilesDir, `${name.toLowerCase().replace(/\//g, "-")}.json`);
    await Deno.writeTextFile(profilePath, JSON.stringify(profile, null, 2));
  }

  async listProfiles(): Promise<string[]> {
    const profiles: string[] = Object.keys(DEFAULT_PROFILES);
    
    try {
      if (await exists(this.profilesDir)) {
        for await (const entry of Deno.readDir(this.profilesDir)) {
          if (entry.isFile && entry.name.endsWith(".json")) {
            const name = entry.name.slice(0, -5).replace(/-/g, "/");
            if (!profiles.includes(name)) {
              profiles.push(name);
            }
          }
        }
      }
    } catch {
      // Ignore errors reading custom profiles
    }

    return profiles.sort();
  }

  async loadYamlConfig<T>(path: string): Promise<T | null> {
    try {
      if (!await exists(path)) return null;
      const content = await Deno.readTextFile(path);
      return parseYaml(content) as T;
    } catch (error) {
      console.warn(`Failed to load YAML config from "${path}":`, error);
      return null;
    }
  }

  async loadJsonConfig<T>(path: string): Promise<T | null> {
    try {
      if (!await exists(path)) return null;
      const content = await Deno.readTextFile(path);
      return parseJsonc(content) as T;
    } catch (error) {
      console.warn(`Failed to load JSON config from "${path}":`, error);
      return null;
    }
  }

  getConfigDir(): string {
    return this.configDir;
  }

  getSettingsFile(): string {
    return this.settingsFile;
  }

  getProfilesDir(): string {
    return this.profilesDir;
  }
}

// Singleton instance
let globalLoader: ConfigLoader | null = null;

export function getConfigLoader(baseDir?: string): ConfigLoader {
  if (!globalLoader) {
    globalLoader = new ConfigLoader(baseDir);
  }
  return globalLoader;
}

export function resetConfigLoader(): void {
  globalLoader = null;
}
