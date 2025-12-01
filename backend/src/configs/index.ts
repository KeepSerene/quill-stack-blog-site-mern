/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type ms from "ms";

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
};

export default configs;
