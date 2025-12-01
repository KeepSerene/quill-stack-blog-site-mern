/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

/**
 * Generates a random username with fixed length (exactly 17 chars)
 * Format: "user-" + timestamp (6 chars) + random (6 chars)
 *
 * @returns A random username (e.g., "user-lm3k9x7k3m9x")
 */
export function generateUsername(): string {
  const prefix = "user-";
  const timestamp = Date.now().toString(36).slice(-6);
  const randomStr = Math.random().toString(36).slice(2, 8);

  return prefix + timestamp + randomStr;
}
