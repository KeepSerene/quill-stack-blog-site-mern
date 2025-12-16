/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { UserDocument } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type UserNameFields = {
  username: string;
  firstName?: string;
  lastName?: string;
};

export function getUserName(
  user: UserNameFields | UserDocument | null | undefined
): string {
  if (!user) {
    return "Anonymous";
  }

  const { firstName, lastName, username } = user;
  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  return fullName || username;
}

/**
 * Calculates estimated reading time for a given text.
 *
 * Uses an average reading speed of 225 words per minute.
 *
 * @param content - Blog content as a string (plain text or markdown)
 * @param wordsPerMinute - Optional custom reading speed (default: 225)
 *
 * @returns An object containing total words and estimated reading time in minutes
 *
 * @example
 * const result = getReadingTime("This is a short blog post...");
 * // result = { words: 6, minutes: 1 }
 */
export function getReadingTime(
  content: string,
  wordsPerMinute = 225
): { words: number; minutes: number } {
  if (!content || typeof content !== "string") {
    return { words: 0, minutes: 0 };
  }

  // normalize whitespace and split into words
  const words = content
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .filter(Boolean).length;

  const minutes = Math.ceil(words / wordsPerMinute);

  return {
    words,
    minutes: Math.max(1, minutes), // minimum 1 minute for non-empty content
  };
}
