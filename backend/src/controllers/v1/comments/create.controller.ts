/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";
import Comment, { type CommentDocument } from "@/models/Comment";
import type { Request, Response } from "express";
import logger from "@/lib/winston";
import Blog from "@/models/Blog";

const window = new JSDOM("").window;
const domPurify = DOMPurify(window);

type CommentData = Pick<CommentDocument, "content">;

export default async function handleCreateComment(req: Request, res: Response) {
  const { blogId } = req.params;
  const userId = req.user?.id;
  const { content } = req.body as CommentData;

  try {
    const blog = await Blog.findById(blogId).select("_id commentCount").exec();

    if (!blog) {
      return res.status(404).json({
        code: "NotFound",
        message: "Blog not found!",
      });
    }

    const cleanedContent = domPurify.sanitize(content);
    const newComment = await Comment.create({
      blogId,
      userId,
      content: cleanedContent,
    });

    blog.commentCount++;
    await blog.save();

    logger.info("New comment created!", newComment);
    res.status(201).json({
      message: "New comment created!",
      comment: newComment,
    });
  } catch (error) {
    logger.error("Error creating comment:", error);
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error!",
    });
  }
}
