/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";
import Blog, { type BlogDocument } from "@/models/Blog";
import type { Request, Response } from "express";
import logger from "@/lib/winston";
import User from "@/models/User";

const window = new JSDOM("").window;
const domPurify = DOMPurify(window);

type BlogData = Partial<
  Pick<BlogDocument, "title" | "content" | "banner" | "status">
>;

export default async function handleUpdateBlogBySlug(
  req: Request,
  res: Response
) {
  const { title, content, banner, status } = req.body as BlogData;
  const userId = req.user?.id;
  const { slug } = req.params;

  try {
    const user = await User.findById(userId).select("role").lean().exec();
    const blog = await Blog.findOne({ slug }).select("-__v").exec();

    if (!user) {
      return res.status(404).json({
        code: "NotFound",
        message: "User not found!",
      });
    }

    if (!blog) {
      return res.status(404).json({
        code: "NotFound",
        message: "Blog not found!",
      });
    }

    if (blog.author !== userId && user.role !== "admin") {
      logger.warn("A user tried to update a blog without permissions!", {
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

    // update blog with available info
    if (title) blog.title = title;

    if (content) {
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

      blog.content = cleanedContent;
    }

    if (banner) blog.banner = banner;
    if (status) blog.status = status;

    // save updated blog
    await blog.save();

    res.status(200).json({
      message: "Blog updated successfully!",
      blog,
    });
  } catch (error: any) {
    logger.error("Failed to update blog", {
      error: error.message,
      stack: error.stack,
      userId,
      slug,
    });

    res.status(500).json({
      code: "ServerError",
      message: "Failed to update blog. Please try again!",
    });
  }
}
