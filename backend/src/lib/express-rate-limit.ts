/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 60000, // 1 min time window
  limit: 60, // allow a max of 60 requests per window per IP
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "Too many requests! Please try again in a minute.",
  },
  // skip rate limiting for certain routes
  skip: (req) => {
    return req.path === "/api/v1/";
  },
});

export default limiter;
