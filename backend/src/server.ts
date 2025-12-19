/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import express from "express";
import cors from "cors";
import type { CorsOptions } from "cors";
import configs from "@/configs";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import compression from "compression";
import limiter from "@/lib/express-rate-limit";
import { connectToDB, disconnectFromDB } from "@/lib/mongoose";
import v1Router from "@/routes/v1";
import logger from "@/lib/winston";
import path from "node:path";

// Express app initialization
const app = express();

// Get __dirname equivalent in ES modules
const __dirname = import.meta.dirname;

// Configure CORS
const allowed = new Set(configs.WHITELISTED_ORIGINS);
const corsOptions: CorsOptions = {
  origin(origin, callback) {
    const dev = configs.NODE_ENV === "development";
    const inWhitelist = origin && allowed.has(origin);

    if (dev || !origin || inWhitelist) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`), false);
      logger.error(`CORS blocked: ${origin}`);
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cookieParser());
app.use(
  compression({
    threshold: 1024, // only compress responses larger than 1KB in size
  })
);
app.use(limiter);

// Start server
(async () => {
  try {
    await connectToDB();

    // API routes
    app.use("/api/v1", v1Router);

    // Production: serve static files and handle client-side routing
    if (configs.NODE_ENV === "production") {
      const frontendDistPath = path.join(__dirname, "../../frontend/dist");

      // serve static files from the React build
      app.use(express.static(frontendDistPath));

      // catch-all route: for any route not matched above, serve index.html
      // this allows React Router to handle routing on the client side
      app.get("/{*any}", (_, res) => {
        res.sendFile(path.join(frontendDistPath, "index.html"));
      });
    } else {
      // Development: 404 error handler for API routes only
      app.use((req, res) => {
        res.status(404).json({
          error: "Route not found!",
          path: req.path,
        });
      });
    }

    // Global error handler
    app.use((err: Error, req: express.Request, res: express.Response) => {
      logger.error("Error:", err);

      res.status(500).json({
        error:
          configs.NODE_ENV === "development"
            ? err.message
            : "Internal server error",
      });
    });

    app.listen(configs.PORT, () => {
      logger.info(`Server running on port ${configs.PORT}`);
      logger.info(`Environment: ${configs.NODE_ENV}`);
    });
  } catch (error) {
    logger.error("Failed to start the server:", error);

    if (configs.NODE_ENV === "production") {
      process.exit(1);
    }
  }
})();

async function handleServerShutdown() {
  try {
    await disconnectFromDB();
    logger.warn("SHUTTING DOWN SERVER...");
    process.exit(0);
  } catch (error) {
    logger.error("Error shutting down server:", error);
  }
}

/**
 * Listen for termination signals (`SIGTERM` and `SIGINT`)
 *
 * - `SIGTERM` is typically sent when stopping a process (e.g., `kill` command or container shutdown).
 * - `SIGINT` is triggered when the user interrupts the process (e.g., pressing `Ctrl + C`).
 * - When either is received, `handleServerShutdown` is executed to ensure proper cleanup.
 */
process.on("SIGTERM", handleServerShutdown);
process.on("SIGINT", handleServerShutdown);
