/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type { Request, Response } from "express";
import User from "@/models/User";
import logger from "@/lib/winston";

export default async function handleDeleteUserById(
  req: Request,
  res: Response
) {
  const userId = req.params.userId;

  try {
    await User.deleteOne({ _id: userId });
    logger.info(`User with ID ${userId} has been deleted by an admin!`);
    res.status(200).json({
      message: "User deleted successfully!",
      userId,
    });
  } catch (error) {
    logger.error(`Error deleting user with ID ${userId}: ${error}`);
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error!",
    });
  }
}
