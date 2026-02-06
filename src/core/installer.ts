// src/core/installer.ts
// Clean, self-contained installer core used by the CLI.
// Exports Installer class and a few helper utilities.

import { logger } from "../utils/logger.ts";

/**
 * Minimal types used by the rest of the project.
 * Keep these lightweight so this file can be a safe drop-in.
 */
export type StepAction = () => Promise<boolean> | boolean;

export interface InstallStep {
  id: string;
  description: string;
  action: StepAction;
  optional?: boolean;
}

export interface InstallOptions {
  dryRun?: boolean;
  profile?: string;
  nonInteractive?: boolean;
}

/**
 * Installer orchestrates a list of steps and reports progress.
 * It intentionally keeps logic simple and avoids template literal pitfalls.
 */
export class Installer {
  private steps: InstallStep[] = [];
  public dryRun: boolean;
  public profile?: string;
  public nonInteractive: boolean;

  constructor(options: InstallOptions = {}) {
    this.dryRun = !!options.dryRun;
    this.profile = options.profile;
    this.nonInteractive = !!options.nonInteractive;
  }

  addStep(step: InstallStep) {
    if (!step || !step.id) {
      throw new Error("Invalid step: id is required");
    }
    this.steps.push(step);
  }

  addSteps(steps: InstallStep[]) {
    for (const s of steps) this.addStep(s);
  }

  async run(): Promise<boolean> {
    logger.info("Installer starting");
    logger.info(`Profile: ${this.profile ?? "none"}`);
    logger.info(`Dry run: ${this.dryRun}`);
    logger.info(`Non-interactive: ${this.nonInteractive}`);

    if (this.dryRun) {
      logger.info("[DRY RUN] No actions will be executed. Listing steps:");
      for (const s of this.steps) {
        logger.info(` - ${s.id}: ${s.description}`);
      }
      return true;
    }

    for (const step of this.steps) {
      logger.info(`Running step: ${step.id} - ${step.description}`);
      try {
        const result = await Promise.resolve(step.action());
        if (!result) {
          logger.warn(`Step failed or returned false: ${step.id}`);
          if (!step.optional) {
            logger.error("Aborting installation due to failed step.");
            return false;
          }
        } else {
          logger.info(`Step succeeded: ${step.id}`);
        }
      } catch (err) {
        logger.error(`Exception while running step ${step.id}:`, err);
        if (!step.optional) {
          logger.error("Aborting installation due to exception.");
          return false;
        }
      }
    }

    logger.info("Installer finished successfully");
    return true;
  }

  /**
   * Convenience factory to create common profile steps.
   * This is intentionally minimal so callers can extend it.
   */
  static createProfileSteps(profile: string): InstallStep[] {
    const steps: InstallStep[] = [];

    steps.push({
      id: "detect-environment",
      description: "Detect environment and platform",
      action: async () => {
        logger.debug("Detecting environment...");
        // Minimal detection placeholder
        return true;
      },
    });

    if (profile === "dev") {
      steps.push({
        id: "install-dev-tools",
        description: "Install developer tools (node, python, git)",
        action: async () => {
          logger.info("Installing developer tools (placeholder)");
          return true;
        },
      });
    }

    if (profile === "kali") {
      steps.push({
        id: "install-kali-tools",
        description: "Install Kali-like toolset (placeholder)",
        action: async () => {
          logger.info("Installing Kali-like tools (placeholder)");
          return true;
        },
      });
    }

    steps.push({
      id: "finalize",
      description: "Finalize installation",
      action: async () => {
        logger.info("Finalizing installation");
        return true;
      },
      optional: false,
    });

    return steps;
  }
}

/**
 * Small helper to run an installer quickly from scripts.
 */
export async function runInstallerForProfile(
  profile: string,
  opts: InstallOptions = {},
): Promise<boolean> {
  const installer = new Installer({ ...opts, profile });
  const steps = Installer.createProfileSteps(profile);
  installer.addSteps(steps);
  return await installer.run();
}
