/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";
import Blog, { type BlogDocument } from "@/models/Blog";
import type { Request, Response } from "express";
import logger from "@/lib/winston";

const window = new JSDOM("").window;
const domPurify = DOMPurify(window);

type BlogData = Pick<BlogDocument, "title" | "content" | "banner" | "status">;

export default async function handleCreateBlog(req: Request, res: Response) {
  const { title, content, banner, status } = req.body as BlogData;
  const userId = req.user?.id;

  const cleanedContent = domPurify.sanitize(content, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "b",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "blockquote",
      "a",
      "img",
      "code",
      "pre",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "class"],
  });

  // Validation check - banner should be set by upload middleware
  if (!banner || !banner.url || !banner.publicId) {
    return res.status(400).json({
      code: "ValidationError",
      message: "Banner image upload failed. Please try again!",
    });
  }

  try {
    const newBlog = await Blog.create({
      title,
      content: cleanedContent,
      author: userId,
      banner,
      status: status || "draft",
    });

    logger.info("Blog created successfully", {
      blogId: newBlog._id,
      title: newBlog.title,
      slug: newBlog.slug,
      author: userId,
      status: newBlog.status,
    });

    res.status(201).json({
      message: "Blog created successfully!",
      blog: {
        id: newBlog._id,
        title: newBlog.title,
        slug: newBlog.slug,
        status: newBlog.status,
        banner: newBlog.banner,
      },
    });
  } catch (error: any) {
    if (error.code === 11000) {
      // handle duplicate slug error
      logger.warn("Duplicate slug detected", { slug: error.keyValue?.slug });

      return res.status(409).json({
        code: "ConflictError",
        message:
          "A blog with this title already exists. Please use a different title!",
      });
    }

    logger.error("Failed to create blog", {
      error: error.message,
      stack: error.stack,
      userId,
    });

    res.status(500).json({
      code: "ServerError",
      message: "Failed to create blog. Please try again!",
    });
  }
}
