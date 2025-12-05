/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type { Request, Response } from "express";
import configs from "@/configs";
import Blog from "@/models/Blog";
import User from "@/models/User";
import logger from "@/lib/winston";

interface BlogStatus {
  status?: "draft" | "published";
}

export default async function handleGetAllBlogs(req: Request, res: Response) {
  const userId = req.user?.id;
  const limit =
    parseInt(req.query.limit as string) || configs.DEFAULT_RESPONSE_LIMIT;
  const offset =
    parseInt(req.query.offset as string) || configs.DEFAULT_RESPONSE_OFFSET;

  try {
    const user = await User.findById(userId).select("role").lean().exec();

    if (!user) {
      return res.status(404).json({
        code: "NotFound",
        message: "User not found!",
      });
    }

    const statusQuery: BlogStatus = {};

    if (user.role === "user") {
      statusQuery.status = "published";
      // admin sees both draft and published (no filter)
    }

    const blogCount = await Blog.countDocuments(statusQuery);
    const blogs = await Blog.find(statusQuery)
      .select("-banner.publicId -__v")
      .populate({
        path: "author",
        select: "-createdAt -updatedAt -__v", // exclude timestamp & __v fields from User
      })
      .limit(limit)
      .skip(offset)
      .sort({ publishedAt: -1 })
      .lean()
      .exec();

    res.status(200).json({
      message: "Blogs fetched successfully!",
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
    logger.error("Failed to fetch blogs", {
      error: error instanceof Error ? error.message : error,
      userId,
      limit,
      offset,
    });

    res.status(500).json({
      code: "ServerError",
      message: "Failed to fetch blogs. Please try again!",
    });
  }
}
