/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type { Request, Response } from "express";
import User from "@/models/User";
import logger from "@/lib/winston";

export default async function handleGetUserById(req: Request, res: Response) {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId).select("-__v").exec();

    if (!user) {
      return res.status(404).json({
        code: "NotFound",
        message: "User not found!",
      });
    }

    res.status(200).json({
      message: "Fetched user successfully!",
      user,
    });
  } catch (error) {
    logger.error(`Error fetching user with ID ${userId}: ${error}`);
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error!",
    });
  }
}
