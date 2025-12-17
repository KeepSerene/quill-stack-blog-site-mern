/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { Router } from "express";
import authRouter from "@/routes/v1/auth.route";
import usersRouter from "@/routes/v1/users.route";
import blogsRouter from "@/routes/v1/blogs.route";
import likesRouter from "@/routes/v1/likes.route";
import commentsRouter from "@/routes/v1/comments.route";
import viewsRouter from "@/routes/v1/views.route";

const router = Router();

// Health check route
router.get("/", (_, res) => {
  res.status(200).json({
    message: "API is up and running!",
    status: "ok",
    version: "1.0.0",
    timestamp: new Date(Date.now()).toLocaleString("en-IN", {
      dateStyle: "long",
      timeStyle: "short",
    }),
  });
});

// Auth routes
router.use("/auth", authRouter);

// Users routes
router.use("/users", usersRouter);

// Blogs routes
router.use("/blogs", blogsRouter);

// Likes routes
router.use("/likes", likesRouter);

// Comments routes
router.use("/comments", commentsRouter);

// Views routes
router.use("/views", viewsRouter);

export default router;
