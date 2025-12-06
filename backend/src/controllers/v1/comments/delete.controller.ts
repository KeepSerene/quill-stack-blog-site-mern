/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import Comment from "@/models/Comment";
import type { Request, Response } from "express";
import logger from "@/lib/winston";
import User from "@/models/User";
import Blog from "@/models/Blog";

export default async function handleDeleteComment(req: Request, res: Response) {
  const { commentId } = req.params;
  const currentUserId = req.user?.id;

  try {
    const comment = await Comment.findById(commentId)
      .select("blogId userId")
      .lean()
      .exec();
    const currentUser = await User.findById(currentUserId)
      .select("role")
      .lean()
      .exec();

    if (!comment) {
      return res.status(404).json({
        code: "NotFound",
        message: "Comment not found!",
      });
    }

    const blog = await Blog.findById(comment.blogId)
      .select("commentCount")
      .exec();

    if (!currentUser) {
      return res.status(404).json({
        code: "NotFound",
        message: "No logged-in user found!",
      });
    }

    if (!blog) {
      return res.status(404).json({
        code: "NotFound",
        message: "Blog not found!",
      });
    }

    if (comment.userId !== currentUserId && currentUser.role !== "admin") {
      logger.warn("A user tried to delete a comment without permissions!", {
        userId: currentUserId,
        comment,
      });

      return res.status(403).json({
        code: "AuthorizationError",
        message: "Access denied, insufficient permissions!",
      });
    }

    // Delete comment
    await Comment.deleteOne({ _id: commentId });

    // Reduce comment count and save blog
    blog.commentCount--;
    await blog.save();

    logger.info("Comment deleted successfully!", {
      commentId,
      blogId: blog._id,
      blogCommentCount: blog.commentCount,
    });
    res.status(200).json({
      message: "Comment deleted successfully!",
      commentId,
      blogId: blog._id,
      blogCommentCount: blog.commentCount,
    });
  } catch (error) {
    logger.error("Error deleting comment:", error);
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error!",
    });
  }
}
