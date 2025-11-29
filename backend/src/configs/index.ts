/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

const configs = {
  PORT: process.env.PORT ?? 3000,
  NODE_ENV: process.env.NODE_ENV ?? "development",
  WHITELISTED_ORIGINS: [process.env.CLIENT_URL ?? "http://localhost:5173"],
  DB_URI: process.env.DB_URI,
  WINSTON_LOG_LEVEL: process.env.WINSTON_LOG_LEVEL ?? "info",
};

export default configs;
