/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type { Request, Response } from "express";
import User from "@/models/User";
import logger from "@/lib/winston";
import Blog from "@/models/Blog";
import Like from "@/models/Like";
import Comment from "@/models/Comment";
import { v2 as cloudinary } from "cloudinary";

export default async function handleDeleteUserById(
  req: Request,
  res: Response
) {
  const userId = req.params.userId;

  try {
    // Find and delete all blogs by this user
    const blogs = await Blog.find({ author: userId })
      .select("banner.publicId")
      .lean()
      .exec();

    if (blogs && blogs.length > 0) {
      const bannerPublicIds = blogs.map(({ banner }) => banner.publicId);

      if (bannerPublicIds.length > 0) {
        // Delete blog banner images for the user
        await cloudinary.api.delete_resources(bannerPublicIds);
        logger.info(
          "Multiple blog banner images deleted from Cloudinary for the user!",
          {
            userId,
            bannerPublicIds,
          }
        );
      }

      // Get blog IDs for cascading deletions
      const blogIds = blogs.map((blog) => blog._id);

      // Delete likes associated with user's blogs
      const deletedBlogLikes = await Like.deleteMany({
        blogId: { $in: blogIds },
      });
      logger.info("Deleted likes associated with user's blogs!", {
        userId,
        deletedCount: deletedBlogLikes.deletedCount,
      });

      // Delete comments associated with user's blogs
      const deletedBlogComments = await Comment.deleteMany({
        blogId: { $in: blogIds },
      });
      logger.info("Deleted comments associated with user's blogs!", {
        userId,
        deletedCount: deletedBlogComments.deletedCount,
      });

      // Delete user's blogs
      await Blog.deleteMany({ author: userId });
      logger.info("Multiple blogs deleted for the user!", {
        userId,
        deletedCount: blogs.length,
      });
    }

    // Delete likes made by this user (on any blog)
    const deletedUserLikes = await Like.deleteMany({ userId });
    logger.info("Deleted likes made by the user!", {
      userId,
      deletedCount: deletedUserLikes.deletedCount,
    });

    // Delete comments made by this user (on any blog)
    const deletedUserComments = await Comment.deleteMany({ userId });
    logger.info("Deleted comments made by the user!", {
      userId,
      deletedCount: deletedUserComments.deletedCount,
    });

    // Delete user
    await User.deleteOne({ _id: userId });
    logger.info(`User with ID ${userId} has been deleted by an admin!`);

    res.status(200).json({
      message: "User deleted successfully!",
      userId,
    });
  } catch (error) {
    logger.error(`Error deleting user with ID ${userId}:`, error);
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error!",
    });
  }
}
