import { BaseModule } from "./base.ts";
import { PlatformInfo } from "../config/schema.ts";
import { logger } from "../utils/logger.ts";
import { PackageManagerHandler } from "../core/package_manager.ts";

export class DevToolsModule extends BaseModule {
  id = "devtools";
  name = "Development Tools";
  description = "Programming languages, IDEs, and development utilities";

  async checkInstalled(platform: PlatformInfo): Promise<boolean> {
    return await this.exists("/usr/bin/python3") || await this.exists("/data/data/com.termux/files/usr/bin/python");
  }

  async install(platform: PlatformInfo, dryRun: boolean): Promise<boolean> {
    logger.info("Installing development tools...");
    
    const packages = this.getPackages(platform);
    
    if (dryRun) {
      logger.info(`Would install: ${packages.join(", ")}`);
      return true;
    }

    const pm = new PackageManagerHandler(platform);
    await pm.update();
    await pm.install(packages);

    // Post-installation setup
    await this.setupPython(platform);
    await this.setupNode(platform);
    await this.setupRust(platform);

    logger.success("Development tools installed");
    return true;
  }

  private getPackages(platform: PlatformInfo): string[] {
    const common = [
      "python3", "python3-pip", "python3-venv",
      "nodejs", "npm",
      "ruby", "ruby-dev",
      "golang", "rustc", "cargo",
      "openjdk-17-jdk", "kotlin",
      "gradle", "maven",
      "clang", "make", "cmake", "gdb",
    ];

    if (platform.isMobile) {
      if (platform.distribution.id === "termux") {
        return ["python", "nodejs", "ruby", "golang", "rust", "kotlin", "gradle", "maven", "clang", "make", "cmake"];
      }
      return ["python3", "py3-pip", "nodejs", "npm", "ruby", "go", "rust", "cargo", "make", "cmake"];
    }

    if (platform.distribution.family === "redhat") {
      return ["python3", "python3-pip", "nodejs", "npm", "golang", "rust", "cargo", "java-17-openjdk-devel", "cmake", "gcc", "gcc-c++", "make"];
    }

    return common;
  }

  private async setupPython(platform: PlatformInfo): Promise<void> {
    logger.step("Setting up Python environment...");
    
    // Upgrade pip
    await this.exec(["python3", "-m", "pip", "install", "--upgrade", "pip"]);
    
    // Install common packages
    const packages = ["virtualenv", "ipython", "jupyter", "numpy", "pandas", "requests", "flask", "django"];
    await this.exec(["python3", "-m", "pip", "install", ...packages]);
  }

  private async setupNode(platform: PlatformInfo): Promise<void> {
    logger.step("Setting up Node.js environment...");
    
    // Install global npm packages
    const packages = ["typescript", "ts-node", "nodemon", "eslint", "prettier", "http-server", "npx"];
    
    for (const pkg of packages) {
      await this.exec(["npm", "install", "-g", pkg]);
    }
  }

  private async setupRust(platform: PlatformInfo): Promise<void> {
    if (platform.isMobile) return; // Skip on mobile
    
    logger.step("Setting up Rust environment...");
    
    // Rustup is usually installed via rustup-init
    if (!await this.exists(`${platform.paths.installDir}/.cargo/bin/rustc`)) {
      await this.exec(["curl", "--proto", "=https", "--tlsv1.2", "-sSf", "https://sh.rustup.rs", "|", "sh"]);
    }
  }

  async uninstall(platform: PlatformInfo): Promise<boolean> {
    const pm = new PackageManagerHandler(platform);
    const packages = this.getPackages(platform);
    await pm.uninstall(packages);
    return true;
  }
}