/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import Comment from "@/models/Comment";
import type { Request, Response } from "express";
import logger from "@/lib/winston";
import Blog from "@/models/Blog";

export default async function handleGetCommentsByBlogId(
  req: Request,
  res: Response
) {
  const { blogId } = req.params;

  try {
    const blog = await Blog.findById(blogId).select("_id").lean().exec();

    if (!blog) {
      return res.status(404).json({
        code: "NotFound",
        message: "Blog not found!",
      });
    }

    const allComments = await Comment.find({ blog: blogId })
      .select("-__v")
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    res.status(200).json({
      message: "Comments fetched successfully!",
      count: allComments.length,
      comments: allComments,
    });
  } catch (error) {
    logger.error("Error fetching comment by blog ID:", error);
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error!",
    });
  }
}
