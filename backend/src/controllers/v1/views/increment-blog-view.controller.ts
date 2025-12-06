/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type { Request, Response } from "express";
import logger from "@/lib/winston";
import Blog from "@/models/Blog";

export default async function handleIncrementBlogView(
  req: Request,
  res: Response
) {
  const { blogId } = req.params;

  try {
    const blog = await Blog.findById(blogId).select("viewCount title").exec();

    if (!blog) {
      return res.status(404).json({
        code: "NotFound",
        message: "Blog not found!",
      });
    }

    // increment view count and save blog
    blog.viewCount++;
    await blog.save();

    logger.info("Blog view incremented successfully!", {
      blogId: blog._id,
      title: blog.title,
      viewCount: blog.viewCount,
    });

    res.status(200).json({
      message: "Blog view incremented successfully!",
      blogId: blog._id,
      viewCount: blog.viewCount,
    });
  } catch (error) {
    logger.error("Failed to increment blog view", error);

    res.status(500).json({
      code: "ServerError",
      message: "Failed to increment blog view. Please try again!",
    });
  }
}
