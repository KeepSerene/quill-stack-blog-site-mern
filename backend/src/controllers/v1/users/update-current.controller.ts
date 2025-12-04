/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type { Request, Response } from "express";
import logger from "@/lib/winston";
import User from "@/models/User";

export default async function handleUpdateCurrentUser(
  req: Request,
  res: Response
) {
  const userId = req.user?.id;
  const {
    username,
    email,
    password,
    firstName,
    lastName,
    websiteUrl,
    gitHubUrl,
    linkedInUrl,
    xUrl,
    youTubeUrl,
    metaUrl,
    instagramUrl,
  } = req.body;

  try {
    const user = await User.findById(userId).select("+password -__v").exec();

    if (!user) {
      return res.status(404).json({
        code: "NotFound",
        message: "User not found!",
      });
    }

    // update user with available info
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (!user.socialLinks) user.socialLinks = {};

    if (websiteUrl) user.socialLinks.website = websiteUrl;
    if (gitHubUrl) user.socialLinks.gitHub = gitHubUrl;
    if (linkedInUrl) user.socialLinks.linkedIn = linkedInUrl;
    if (xUrl) user.socialLinks.x = xUrl;
    if (youTubeUrl) user.socialLinks.youTube = youTubeUrl;
    if (metaUrl) user.socialLinks.meta = metaUrl;
    if (instagramUrl) user.socialLinks.instagram = instagramUrl;

    // save updated user
    await user.save();

    res.status(200).json({
      message: "Current user updated successfully!",
      user,
    });
  } catch (error) {
    logger.error("Error updating current user:", error);
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error!",
    });
  }
}
