/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type { Request, Response } from "express";
import configs from "@/configs";
import Comment from "@/models/Comment";
import logger from "@/lib/winston";

export default async function handleGetAllComments(
  req: Request,
  res: Response
) {
  const limit =
    parseInt(req.query.limit as string) || configs.DEFAULT_RESPONSE_LIMIT;
  const offset =
    parseInt(req.query.offset as string) || configs.DEFAULT_RESPONSE_OFFSET;

  try {
    const commentCount = await Comment.countDocuments();
    const comments = await Comment.find()
      .select("-__v")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .lean()
      .exec();

    res.status(200).json({
      message: "Fetched comments successfully!",
      data: {
        comments,
        pagination: {
          total: commentCount, // total matching the query
          count: comments.length, // current page count
          limit,
          offset,
          hasMore: commentCount > comments.length + offset,
        },
      },
    });
  } catch (error) {
    logger.error("Error fetching all comments:", error);
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error!",
    });
  }
}
