/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import logger from "@/lib/winston";
import Blog from "@/models/Blog";
import User from "@/models/User";
import type { Request, Response } from "express";

export default async function handleGetBlogBySlug(req: Request, res: Response) {
  const userId = req.user?.id;
  const { slug } = req.params;

  try {
    const user = await User.findById(userId).select("role").lean().exec();

    if (!user) {
      return res.status(404).json({
        code: "NotFound",
        message: "No logged-in user found!",
      });
    }

    const blog = await Blog.findOne({ slug })
      .select("-banner.publicId -__v")
      .populate({ path: "author", select: "-createdAt -updatedAt -__v" })
      .lean()
      .exec();

    if (!blog) {
      return res.status(404).json({
        code: "NotFound",
        message: "Blog not found!",
      });
    }

    if (user.role === "user" && blog.status === "draft") {
      logger.warn("A user tried to access a draft blog!", {
        userId,
        blog: {
          _id: blog._id,
          title: blog.title,
          slug: blog.slug,
          status: blog.status,
        },
      });

      return res.status(403).json({
        code: "AuthorizationError",
        message: "Access denied, insufficient permissions!",
      });
    }

    res.status(200).json({
      message: "Blog fetched successfully!",
      blog,
    });
  } catch (error) {
    logger.error("Error fetching blog by slug:", error);
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error!",
    });
  }
}
