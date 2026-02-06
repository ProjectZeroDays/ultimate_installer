import { crypto } from "@std/crypto";
import { encodeHex } from "@std/encoding";
import { logger } from "./logger.ts";

export async function calculateSHA256(filePath: string): Promise<string> {
  const data = await Deno.readFile(filePath);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return encodeHex(hash);
}

export async function verifyChecksum(filePath: string, expectedChecksum: string): Promise<boolean> {
  logger.step("Verifying checksum...");

  const actualChecksum = await calculateSHA256(filePath);

  if (actualChecksum.toLowerCase() !== expectedChecksum.toLowerCase()) {
    logger.error(`Checksum mismatch!`);
    logger.error(`Expected: ${expectedChecksum}`);
    logger.error(`Actual:   ${actualChecksum}`);
    return false;
  }

  logger.success("Checksum verified");
  return true;
}
