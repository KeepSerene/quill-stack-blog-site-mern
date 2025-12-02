/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type { Types } from "mongoose";
import configs from "@/configs";
import jwt from "jsonwebtoken";

export function generateAccessToken(userId: Types.ObjectId) {
  if (!configs.JWT_ACCESS_SECRET) {
    throw new Error("JWT_ACCESS_SECRET is missing!");
  }

  return jwt.sign({ userId }, configs.JWT_ACCESS_SECRET, {
    expiresIn: configs.JWT_ACCESS_EXPIRES_IN,
    subject: "Access Blogs API",
  });
}

export function generateRefreshToken(userId: Types.ObjectId) {
  if (!configs.JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET is missing!");
  }

  return jwt.sign({ userId }, configs.JWT_REFRESH_SECRET, {
    expiresIn: configs.JWT_REFRESH_EXPIRES_IN,
    subject: "Access Blogs API",
  });
}

export function validateAndDecodeAccessToken(token: string) {
  if (!configs.JWT_ACCESS_SECRET) {
    throw new Error("JWT_ACCESS_SECRET is missing!");
  }

  return jwt.verify(token, configs.JWT_ACCESS_SECRET);
}

export function validateAndDecodeRefreshToken(token: string) {
  if (!configs.JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET is missing!");
  }

  return jwt.verify(token, configs.JWT_REFRESH_SECRET);
}
