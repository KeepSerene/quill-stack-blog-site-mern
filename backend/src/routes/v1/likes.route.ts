/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { Router } from "express";
import { body, param } from "express-validator";
import handleLikeBlog from "@/controllers/v1/likes/like-blog.controller";
import handleUnlikeBlog from "@/controllers/v1/likes/unlike-blog.controller";
import handleAuthenticate from "@/middlewares/authenticate.middleware";
import handleAuthorize from "@/middlewares/authorize.middleware";
import handleValidationErrors from "@/middlewares/validation-errors.middleware";

const router = Router();

// Express validator middlewares
const blogIdAndUserIdValidation = [
  param("blogId")
    .notEmpty()
    .withMessage("Blog ID is required!")
    .isMongoId()
    .withMessage("Invalid blog ID!"),
  body("userId")
    .notEmpty()
    .withMessage("User ID is required!")
    .isMongoId()
    .withMessage("Invalid user ID!"),
];

// POST /api/v1/likes/blogs/:blogId
router.post(
  "/blogs/:blogId",
  handleAuthenticate,
  handleAuthorize(["admin", "user"]),
  blogIdAndUserIdValidation,
  handleValidationErrors,
  handleLikeBlog
);

// DELETE /api/v1/likes/blogs/:blogId
router.delete(
  "/blogs/:blogId",
  handleAuthenticate,
  handleAuthorize(["admin", "user"]),
  blogIdAndUserIdValidation,
  handleValidationErrors,
  handleUnlikeBlog
);

export default router;
