/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import configs from "@/configs";
import winston from "winston";

const { combine, timestamp, json, errors, align, printf, colorize } =
  winston.format;

const transports: winston.transport[] = []; // destinations where logs are sent (console, file, database, etc.)

// Development: colorized console output
if (configs.NODE_ENV !== "production") {
  transports.push(
    // Console transport: send logs to the terminal/console
    new winston.transports.Console({
      // "combine" chains multiple formatting functions together.
      // logs will pass through each formatter in order
      format: combine(
        // adds current data and time where 'A' means AM/PM
        timestamp({ format: "DD-MM-YYYY hh:mm:ss A" }),
        // ensures log messages line up nicely
        align(),
        // defines exactly how logs should look
        printf(({ timestamp, level, message, ...meta }) => {
          const metaStr =
            Object.keys(meta).length > 0
              ? `\n${JSON.stringify(meta, null, 2)}`
              : "";

          return `${timestamp} [${level.toUpperCase()}]: ${message}${metaStr}`;
        }),
        // adds ANSI color codes to everything (level, message, etc.)
        // apply colorize last (IMPORTANT!)
        colorize({ all: true })
      ),
    })
  );
} else {
  // Production: JSON format to console (for cloud logging services)
  transports.push(
    new winston.transports.Console({
      format: combine(timestamp(), errors({ stack: true }), json()),
    })
  );
}

const logger = winston.createLogger({
  level: configs.WINSTON_LOG_LEVEL,
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports,
  silent: configs.NODE_ENV === "test",
});

export default logger;
