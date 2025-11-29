/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { Router } from "express";

const router = Router();

router.get("/", (_, res) => {
  res.status(200).json({
    message: "API is up and running!",
    status: "ok",
    version: "1.0.0",
    docs: "",
    timestamp: new Date().toISOString(),
  });
});

export default router;
