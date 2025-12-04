/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type { NextFunction, Request, Response } from "express";
import { validateAndDecodeAccessToken } from "@/lib/jwt";
import type { Types } from "mongoose";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import logger from "@/lib/winston";

export default async function handleAuthenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      code: "AuthorizationError",
      message: "Access denied, no token provided!",
    });
  }

  const token = authHeader?.split(" ")?.[1];

  try {
    const decoded = validateAndDecodeAccessToken(token) as {
      userId: Types.ObjectId;
    };
    req.user = { id: decoded.userId };

    return next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({
        code: "TokenExpired",
        message: "Token has expired!",
      });
    }

    if (error instanceof JsonWebTokenError) {
      return res.status(401).json({
        code: "InvalidToken",
        message: "Invalid token!",
      });
    }

    logger.error("Error refreshing token:", error);
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error!",
    });
  }
}
