/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type { Request, Response } from "express";
import configs from "@/configs";
import User from "@/models/User";
import logger from "@/lib/winston";

export default async function handleGetAllUsers(req: Request, res: Response) {
  const limit =
    parseInt(req.query.limit as string) || configs.DEFAULT_RESPONSE_LIMIT;
  const offset =
    parseInt(req.query.offset as string) || configs.DEFAULT_RESPONSE_OFFSET;

  try {
    const userCount = await User.countDocuments();
    const users = await User.find()
      .select("-__v")
      .limit(limit)
      .skip(offset)
      .lean()
      .exec();

    res.status(200).json({
      message: "Fetched users successfully!",
      total: userCount,
      count: users.length,
      limit,
      offset,
      users,
    });
  } catch (error) {
    logger.error("Error fetching all users:", error);
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error!",
    });
  }
}
