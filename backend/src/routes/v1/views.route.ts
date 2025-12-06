/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { Router } from "express";
import { param } from "express-validator";
import handleAuthenticate from "@/middlewares/authenticate.middleware";
import handleAuthorize from "@/middlewares/authorize.middleware";
import handleValidationErrors from "@/middlewares/validation-errors.middleware";
import handleIncrementBlogView from "@/controllers/v1/views/increment-blog-view.controller";

const router = Router();

// Express validator middlewares
const blogIdValidation = param("blogId")
  .isMongoId()
  .withMessage("Invalid blog ID!");

// POST /api/v1/views/blogs/:blogId
router.post(
  "/blogs/:blogId",
  handleAuthenticate,
  handleAuthorize(["admin", "user"]),
  blogIdValidation,
  handleValidationErrors,
  handleIncrementBlogView
);

export default router;
