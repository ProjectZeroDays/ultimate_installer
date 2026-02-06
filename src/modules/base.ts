import { PlatformInfo } from "../config/schema.ts";

export interface Module {
  id: string;
  name: string;
  description: string;
  
  checkInstalled(platform: PlatformInfo): Promise<boolean>;
  install(platform: PlatformInfo, dryRun: boolean): Promise<boolean>;
  uninstall(platform: PlatformInfo): Promise<boolean>;
}

export abstract class BaseModule implements Module {
  abstract id: string;
  abstract name: string;
  abstract description: string;
  
  abstract checkInstalled(platform: PlatformInfo): Promise<boolean>;
  abstract install(platform: PlatformInfo, dryRun: boolean): Promise<boolean>;
  abstract uninstall(platform: PlatformInfo): Promise<boolean>;
  
  protected async exec(cmd: string[]): Promise<{ success: boolean; output: string }> {
    try {
      const process = new Deno.Command(cmd[0], {
        args: cmd.slice(1),
        stdout: "piped",
        stderr: "piped",
      });
      const { code, stdout, stderr } = await process.output();
      const decoder = new TextDecoder();
      return {
        success: code === 0,
        output: decoder.decode(stdout) || decoder.decode(stderr),
      };
    } catch (error) {
      return {
        success: false,
        output: error instanceof Error ? error.message : String(error),
      };
    }
  }

  protected async exists(path: string): Promise<boolean> {
    try {
      await Deno.stat(path);
      return true;
    } catch {
      return false;
    }
  }
}