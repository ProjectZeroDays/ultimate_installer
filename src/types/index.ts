// src/types/index.ts - Common types used across the application
export interface AppDefinition {
  id: string;
  name: string;
  category: string;
  osFilter?: string;
  subCategory?: string;
  description?: string;
  warning?: string;
  confirm?: boolean;
  priority?: string;
  dependencies?: string[];
  configHooks?: string[];
  winIds?: Record<string, string>;
  macIds?: Record<string, string>;
  linuxIds?: Record<string, string>;
}

export interface OSDetails {
  type: "Windows" | "macOS" | "Linux" | "Unknown";
  distro: string;
  version: string;
  build: string;
  architecture: string;
  isServer: boolean;
  isWSL: boolean;
  isContainer: boolean;
  packageManagers: string[];
  configPath: string;
  shell: string;
  desktopEnvironment: string;
  hasGUI: boolean;
  compatibility: string[];
}

export interface InstallLog {
  sessionId: string;
  startTime: string;
  endTime?: string;
  duration?: string;
  os: OSDetails;
  actions: LogAction[];
  errors: LogError[];
  settings: Record<string, unknown>;
  success?: string[];
  failed?: string[];
}

export interface LogAction {
  time: string;
  level: string;
  category: string;
  message: string;
}

export interface LogError {
  app: string;
  error: string;
  time: string;
}

export type ColorScheme = "Default" | "Dark" | "Light" | "HighContrast";
