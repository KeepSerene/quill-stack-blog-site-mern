/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type { Request, Response } from "express";
import logger from "@/lib/winston";
import RefreshToken from "@/models/RefreshToken";
import configs from "@/configs";

export default async function handleLogout(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies["refresh-token"] as string;

    if (refreshToken) {
      await RefreshToken.deleteOne({ token: refreshToken });
      logger.info("Refresh token deleted for user!", {
        userId: req.user?.id,
      });
    }

    res.clearCookie("refresh-token", {
      httpOnly: true,
      secure: configs.NODE_ENV === "production",
      sameSite: "strict",
    });

    logger.info("User logged out successfully!", {
      userId: req.user?.id,
    });
    res.status(200).json({
      message: "User logged out successfully!",
      userId: req.user?.id,
    });
  } catch (error) {
    logger.error("Error logging out user:", error);
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error!",
    });
  }
}
