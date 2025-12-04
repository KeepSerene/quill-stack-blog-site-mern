/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type { Request, Response } from "express";
import logger from "@/lib/winston";
import User from "@/models/User";

export default async function handleDeleteCurrentUser(
  req: Request,
  res: Response
) {
  const userId = req.user?.id;

  try {
    await User.deleteOne({ _id: userId });
    logger.info(`User with ID ${userId} has been deleted!`);
    res.status(200).json({
      message: "User deleted successfully!",
      userId,
    });
  } catch (error) {
    logger.error("Error deleting current user:", error);
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error!",
    });
  }
}
