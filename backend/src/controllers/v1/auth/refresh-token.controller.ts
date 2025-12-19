/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import logger from "@/lib/winston";
import RefreshToken from "@/models/RefreshToken";
import type { Request, Response } from "express";
import { generateAccessToken, validateAndDecodeRefreshToken } from "@/lib/jwt";
import type { Types } from "mongoose";
import jwt from "jsonwebtoken";

export default async function handleRefreshToken(req: Request, res: Response) {
  const refreshToken = req.cookies["refresh-token"] as string;

  try {
    const tokenExists = await RefreshToken.exists({ token: refreshToken });

    if (!tokenExists) {
      return res.status(401).json({
        code: "AuthenticationError",
        message: "Invalid refresh token!",
      });
    }

    const decoded = validateAndDecodeRefreshToken(refreshToken) as {
      userId: Types.ObjectId;
    };
    const accessToken = generateAccessToken(decoded.userId);

    res.status(200).json({
      message: "Token refreshed successfully!",
      accessToken,
    });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        code: "TokenExpired",
        message: "Token has expired!",
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
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
