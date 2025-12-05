/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type { Request, Response } from "express";
import logger from "@/lib/winston";
import Blog from "@/models/Blog";
import Like from "@/models/Like";

export default async function handleUnlikeBlog(req: Request, res: Response) {
  const { blogId } = req.params;
  const { userId } = req.body;

  try {
    const existingLike = await Like.findOne({ blogId, userId }).lean().exec();

    if (!existingLike) {
      return res.status(404).json({
        code: "NotFound",
        message: "Like not found!",
      });
    }

    const blog = await Blog.findById(blogId).select("likeCount").exec();

    if (!blog) {
      return res.status(404).json({
        code: "NotFound",
        message: "Blog not found!",
      });
    }

    // UnLike and save blog
    await Like.deleteOne({ _id: existingLike._id });
    blog.likeCount--;
    await blog.save();

    logger.info("Unliked blog successfully!", {
      userId,
      blogId: blog._id,
      likeCount: blog.likeCount,
    });

    res.status(200).json({
      message: "Unliked blog successfully!",
      blogId: blog._id,
      likeCount: blog.likeCount,
    });
  } catch (error) {
    logger.error("Failed to unlike the blog", error);

    res.status(500).json({
      code: "ServerError",
      message: "Failed to unlike the blog. Please try again!",
    });
  }
}
