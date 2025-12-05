/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import crypto from "crypto";

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

/**
 * Generates a URL-friendly slug from a title with a random suffix for uniqueness.
 *
 * @param title The text to convert into a slug
 * @returns A unique, URL-safe slug string
 *
 * @example
 * generateSlug("Public Blog 💜") -> "public-blog-bbad3272"
 * generateSlug("Hello   World!!!") -> "hello-world-a1b2c3d4"
 * generateSlug("---Special---Case---") -> "special-case-f5e6d7c8"
 */
export function generateSlug(title: string): string {
  // normalize the title
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // removes emojis + unusual chars
    .replace(/\s+/g, "-") // spaces -> hyphens
    .replace(/-+/g, "-") // collapses multiple hyphens
    .replace(/^-+|-+$/g, ""); // removes leading/trailing hyphens

  // edge case where title has no valid characters
  const cleanSlug = baseSlug || "untitled";

  // 8 random hex chars for uniqueness
  const randomSuffix = crypto.randomBytes(4).toString("hex");

  return `${cleanSlug}-${randomSuffix}`;
}
