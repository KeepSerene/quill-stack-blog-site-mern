/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import configs from "@/configs";
import winston from "winston";

const { combine, timestamp, json, errors, align, printf, colorize } =
  winston.format;

const transports: winston.transport[] = [];

if (configs.NODE_ENV !== "production") {
  transports.push(
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: "DD-MM-YYYY hh:mm:ss A" }),
        align(),
        printf(({ timestamp, level, message, ...meta }) => {
          const metaStr =
            Object.keys(meta).length > 0 ? `\n${JSON.stringify(meta)}` : "";

          return `${timestamp} [${level.toUpperCase()}]: ${message}${metaStr}`;
        })
      ),
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
