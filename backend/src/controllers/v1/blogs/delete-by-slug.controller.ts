/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import logger from "@/lib/winston";
import User from "@/models/User";
import Blog from "@/models/Blog";
import Like from "@/models/Like";
import Comment from "@/models/Comment";

export default async function handleDeleteBlogBySlug(
  req: Request,
  res: Response
) {
  const userId = req.user?.id;
  const { slug } = req.params;

  try {
    const user = await User.findById(userId).select("role").lean().exec();

    if (!user) {
      return res.status(404).json({
        code: "NotFound",
        message: "User not found!",
      });
    }

    const blog = await Blog.findOne({ slug })
      .select("_id author banner.publicId title slug status")
      .lean()
      .exec();

    if (!blog) {
      return res.status(404).json({
        code: "NotFound",
        message: "Blog not found!",
      });
    }

    if (blog.author !== userId && user.role !== "admin") {
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
        message: "Access denied, insufficient permissions!",
      });
    }

    const blogId = blog._id;

    // Delete associated likes
    const deletedLikes = await Like.deleteMany({ blogId });
    logger.info("Deleted likes associated with blog!", {
      blogId,
      slug,
      deletedCount: deletedLikes.deletedCount,
    });

    // Delete associated comments
    const deletedComments = await Comment.deleteMany({ blogId });
    logger.info("Deleted comments associated with blog!", {
      blogId,
      slug,
      deletedCount: deletedComments.deletedCount,
    });

    // Delete blog banner from Cloudinary
    await cloudinary.uploader.destroy(blog.banner.publicId);
    logger.info("Blog banner image deleted from Cloudinary!", {
      blogId,
      slug,
      bannerPublicId: blog.banner.publicId,
    });

    // Delete blog
    await Blog.deleteOne({ _id: blogId });
    logger.info("Blog deleted successfully!", { blogId, slug });

    res.status(200).json({
      message: "Blog deleted successfully!",
      blogId,
      slug,
    });
  } catch (error: any) {
    logger.error("Failed to delete blog", error);

    res.status(500).json({
      code: "ServerError",
      message: "Failed to delete blog. Please try again!",
    });
  }
}
