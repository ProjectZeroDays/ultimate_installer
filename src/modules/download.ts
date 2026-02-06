import { logger } from "./logger.ts";

export interface DownloadOptions {
  url: string;
  outputPath: string;
  headers?: Record<string, string>;
  timeout?: number;
}

export async function download(options: DownloadOptions): Promise<boolean> {
  const { url, outputPath, headers = {}, timeout = 30000 } = options;

  logger.step(`Downloading: ${url}`);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = new Uint8Array(await response.arrayBuffer());
    await Deno.writeFile(outputPath, data);

    logger.success(`Downloaded to: ${outputPath}`);
    return true;
  } catch (error) {
    logger.error(`Download failed: ${error}`);
    return false;
  }
}

export async function downloadText(url: string, headers?: Record<string, string>): Promise<string | null> {
  try {
    const response = await fetch(url, { headers });
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  }
}
