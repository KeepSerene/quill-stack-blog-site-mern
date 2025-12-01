/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { Router } from "express";
import authRouter from "./auth";

const router = Router();

// Health check route
router.get("/", (_, res) => {
  res.status(200).json({
    message: "API is up and running!",
    status: "ok",
    version: "1.0.0",
    docs: "",
    timestamp: new Date().toISOString(),
  });
});

// Auth routes
router.use("/auth", authRouter);

export default router;
