/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type { Request, Response } from "express";
import User from "@/models/User";
import logger from "@/lib/winston";
import Blog from "@/models/Blog";
import { v2 as cloudinary } from "cloudinary";

export default async function handleDeleteUserById(
  req: Request,
  res: Response
) {
  const userId = req.params.userId;

  try {
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
          "Multiple blog banner images deleted from Cloudinary for the user!",
          {
            userId,
            bannerPublicIds,
          }
        );
      }

      // Delete blogs for the current images
      await Blog.deleteMany({ author: userId });
      logger.info("Multiple blogs deleted for the user!", {
        userId,
        blogs,
      });
    }

    // Delete user
    await User.deleteOne({ _id: userId });
    logger.info(`User with ID ${userId} has been deleted by an admin!`);
    res.status(200).json({
      message: "User deleted successfully!",
      userId,
    });
  } catch (error) {
    logger.error(`Error deleting user with ID ${userId}: ${error}`);
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error!",
    });
  }
}
