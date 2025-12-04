/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type { Request, Response } from "express";
import logger from "@/lib/winston";
import User from "@/models/User";

export default async function handleGetCurrentUser(
  req: Request,
  res: Response
) {
  const userId = req.user?.id; // currently logged-in user's ID

  try {
    const user = await User.findById(userId).select("-__v").lean().exec();

    if (!user) {
      return res.status(404).json({
        code: "NotFound",
        message: "User not found!",
      });
    }

    res.status(200).json({
      message: "Fetched current user successfully!",
      user,
    });
  } catch (error) {
    logger.error("Error fetching current user:", error);
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error!",
    });
  }
}
