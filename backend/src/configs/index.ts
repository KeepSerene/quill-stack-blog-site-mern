/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type ms from "ms";

if (!process.env.ADMIN_EMAILS) {
  throw new Error("ADMIN_EMAILS is missing in environment variables!");
}

const configs = {
  PORT: process.env.PORT ?? 3000,
  NODE_ENV: process.env.NODE_ENV ?? "development",
  WHITELISTED_ORIGINS: [process.env.CLIENT_URL ?? "http://localhost:5173"],
  DB_URI: process.env.DB_URI,
  WINSTON_LOG_LEVEL: process.env.WINSTON_LOG_LEVEL ?? "info",
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES_IN: (process.env.JWT_ACCESS_EXPIRES_IN ??
    "15m") as ms.StringValue,
  JWT_REFRESH_EXPIRES_IN: (process.env.JWT_REFRESH_EXPIRES_IN ??
    "7d") as ms.StringValue,
  WHITELISTED_ADMIN_EMAILS: process.env.ADMIN_EMAILS.split(","),
};

console.log(
  "Configs WHITELISTED_ADMIN_EMAILS",
  configs.WHITELISTED_ADMIN_EMAILS
);

export default configs;
