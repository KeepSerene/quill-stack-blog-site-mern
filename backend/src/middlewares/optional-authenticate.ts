/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 *
 * Optional authentication middleware - allows requests to proceed
 * whether authenticated or not. Attaches user info if token is valid.
 */

import type { NextFunction, Request, Response } from "express";
import { validateAndDecodeAccessToken } from "@/lib/jwt";
import type { Types } from "mongoose";
import jwt from "jsonwebtoken";
import logger from "@/lib/winston";

export default async function handleOptionalAuthenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  // no token provided - continue as unauthenticated user
  if (!authHeader?.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader?.split(" ")?.[1];

  try {
    const decoded = validateAndDecodeAccessToken(token) as {
      userId: Types.ObjectId;
    };
    req.user = { id: decoded.userId };

    return next();
  } catch (error) {
    // token validation failed - log it but continue as unauthenticated
    if (error instanceof jwt.TokenExpiredError) {
      logger.debug("Expired token in optional auth", { error: error.message });
    } else if (error instanceof jwt.JsonWebTokenError) {
      logger.debug("Invalid token in optional auth", { error: error.message });
    } else {
      logger.error("Error in optional authentication:", error);
    }

    // continue without authentication
    return next();
  }
}
