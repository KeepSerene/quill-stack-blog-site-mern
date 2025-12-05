/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import logger from "@/lib/winston";
import User from "@/models/User";
import Blog from "@/models/Blog";

export default async function handleDeleteBlogById(
  req: Request,
  res: Response
) {
  const userId = req.user?.id;
  const { blogId } = req.params;

  try {
    const user = await User.findById(userId).select("role").lean().exec();

    if (!user) {
      return res.status(404).json({
        code: "NotFound",
        message: "User not found!",
      });
    }

    const blog = await Blog.findById(blogId)
      .select("author banner.publicId")
      .lean()
      .exec();

    if (!blog) {
      return res.status(404).json({
        code: "NotFound",
        message: "Blog not found!",
      });
    }

    if (blog.author !== userId && user.role !== "admin") {
      // one admin cannot delete another admin's blog
      // also, normal users can't delete a blog
      logger.warn("A user tried to delete a blog without permissions!", {
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
        message: "Access denied, insufficient permissons!",
      });
    }

    await cloudinary.uploader.destroy(blog.banner.publicId);
    logger.info("Blog banner image deleted from Cloudinary!", {
      blogId,
      bannerPublicId: blog.banner.publicId,
    });

    await Blog.deleteOne({ _id: blogId });
    logger.info("Blog deleted successfully!", { blogId });

    res.status(200).json({
      message: "Blog deleted successfully!",
      blogId,
    });
  } catch (error: any) {
    logger.error("Failed to delete blog", error);

    res.status(500).json({
      code: "ServerError",
      message: "Failed to delete blog. Please try again!",
    });
  }
}
