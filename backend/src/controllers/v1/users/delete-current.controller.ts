/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type { Request, Response } from "express";
import logger from "@/lib/winston";
import User from "@/models/User";
import Blog from "@/models/Blog";
import Like from "@/models/Like";
import Comment from "@/models/Comment";
import { v2 as cloudinary } from "cloudinary";

export default async function handleDeleteCurrentUser(
  req: Request,
  res: Response
) {
  const userId = req.user?.id;

  try {
    // Find and delete all blogs by current user
    const blogs = await Blog.find({ author: userId })
      .select("banner.publicId")
      .lean()
      .exec();

    if (blogs && blogs.length > 0) {
      const bannerPublicIds = blogs.map(({ banner }) => banner.publicId);

      if (bannerPublicIds.length > 0) {
        // Delete blog banner images for the current user
        await cloudinary.api.delete_resources(bannerPublicIds);
        logger.info(
          "Multiple blog banner images deleted from Cloudinary for the current user!",
          {
            userId,
            bannerPublicIds,
          }
        );
      }

      // Get blog IDs for cascading deletions
      const blogIds = blogs.map((blog) => blog._id);

      // Delete likes associated with current user's blogs
      const deletedBlogLikes = await Like.deleteMany({
        blogId: { $in: blogIds },
      });
      logger.info("Deleted likes associated with current user's blogs!", {
        userId,
        deletedCount: deletedBlogLikes.deletedCount,
      });

      // Delete comments associated with current user's blogs
      const deletedBlogComments = await Comment.deleteMany({
        blogId: { $in: blogIds },
      });
      logger.info("Deleted comments associated with current user's blogs!", {
        userId,
        deletedCount: deletedBlogComments.deletedCount,
      });

      // Delete current user's blogs
      await Blog.deleteMany({ author: userId });
      logger.info("Multiple blogs deleted for the current user!", {
        userId,
        deletedCount: blogs.length,
      });
    }

    // Delete likes made by current user (on any blog)
    const deletedUserLikes = await Like.deleteMany({ userId });
    logger.info("Deleted likes made by the current user!", {
      userId,
      deletedCount: deletedUserLikes.deletedCount,
    });

    // Delete comments made by current user (on any blog)
    const deletedUserComments = await Comment.deleteMany({ userId });
    logger.info("Deleted comments made by the current user!", {
      userId,
      deletedCount: deletedUserComments.deletedCount,
    });

    // Delete current user
    await User.deleteOne({ _id: userId });
    logger.info(`User with ID ${userId} has been deleted!`);

    res.status(200).json({
      message: "User deleted successfully!",
      userId,
    });
  } catch (error) {
    logger.error("Error deleting current user:", error);
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error!",
    });
  }
}
