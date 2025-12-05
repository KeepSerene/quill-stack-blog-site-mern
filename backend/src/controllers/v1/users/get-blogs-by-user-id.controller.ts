/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type { Request, Response } from "express";
import logger from "@/lib/winston";
import configs from "@/configs";
import User from "@/models/User";
import Blog from "@/models/Blog";

interface BlogStatus {
  status?: "draft" | "published";
}

export default async function handleGetBlogsByUserId(
  req: Request,
  res: Response
) {
  const { userId } = req.params; // intended user ID
  const currentUserId = req.user?.id; // currently logged-in user ID
  const limit =
    parseInt(req.query.limit as string) || configs.DEFAULT_RESPONSE_LIMIT;
  const offset =
    parseInt(req.query.offset as string) || configs.DEFAULT_RESPONSE_OFFSET;

  try {
    const currentUser = await User.findById(currentUserId)
      .select("role")
      .lean()
      .exec();

    if (!currentUser) {
      return res.status(404).json({
        code: "NotFound",
        message: "No logged-in user found!",
      });
    }

    const statusQuery: BlogStatus = {};

    if (currentUser.role === "user") {
      statusQuery.status = "published";
      // admin sees both draft and published (no filter)
    }

    const blogCount = await Blog.countDocuments({
      author: userId,
      ...statusQuery,
    });
    const blogs = await Blog.find({ author: userId, ...statusQuery })
      .select("-banner.publicId -__v")
      .populate({
        path: "author",
        select: "-createdAt -updatedAt -__v",
      })
      .limit(limit)
      .skip(offset)
      .sort({ publishedAt: -1 })
      .lean()
      .exec();

    res.status(200).json({
      message: "Blogs by user fetched successfully!",
      data: {
        blogs,
        pagination: {
          total: blogCount, // total matching the filter
          count: blogs.length, // current page count
          limit,
          offset,
          hasMore: blogCount > blogs.length + offset,
        },
      },
    });
  } catch (error) {
    logger.error(`Error fetching blogs by user with ID ${userId}: ${error}`);
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error!",
    });
  }
}
