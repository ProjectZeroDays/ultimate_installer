import { ensureDir } from "@std/fs";
import { logger } from "./logger.ts";

export async function ensureDirectory(path: string): Promise<void> {
  await ensureDir(path);
}

export async function exists(path: string): Promise<boolean> {
  try {
    await Deno.stat(path);
    return true;
  } catch {
    return false;
  }
}

export async function copyFile(src: string, dest: string): Promise<void> {
  await ensureDirectory(dest.substring(0, dest.lastIndexOf("/")));
  await Deno.copyFile(src, dest);
}

export async function removeFile(path: string): Promise<void> {
  try {
    await Deno.remove(path);
  } catch {
    // Ignore errors
  }
}
