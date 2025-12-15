/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { Router } from "express";
import { body, param, query } from "express-validator";
import handleAuthenticate from "@/middlewares/authenticate.middleware";
import handleAuthorize from "@/middlewares/authorize.middleware";
import handleValidationErrors from "@/middlewares/validation-errors.middleware";
import handleGetAllComments from "@/controllers/v1/comments/get-all.controller";
import handleGetCommentsByBlogId from "@/controllers/v1/comments/get-by-blog-id.controller";
import handleCreateComment from "@/controllers/v1/comments/create.controller";
import handleDeleteComment from "@/controllers/v1/comments/delete.controller";

const router = Router();

// Express validator middlewares
const getAllCommentsValidation = [
  query("limit")
    .optional()
    .toInt()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 and 50"),
  query("offset")
    .optional()
    .toInt()
    .isInt({ min: 0 })
    .withMessage("Offset must be a non-negative integer"),
];

const getCommentByBlogIdValidation = param("blogId")
  .isMongoId()
  .withMessage("Invalid blog ID!");

const createCommentValidation = [
  param("blogId").isMongoId().withMessage("Invalid blog ID!"),
  body("content").trim().notEmpty().withMessage("Content is required!"),
];

const deleteCommentValidation = param("commentId")
  .isMongoId()
  .withMessage("Invalid comment ID!");

// GET /api/v1/comments
router.get(
  "/",
  handleAuthenticate,
  handleAuthorize(["admin"]),
  getAllCommentsValidation,
  handleValidationErrors,
  handleGetAllComments
);

// GET /api/v1/comments/blogs/:blogId
router.get(
  "/blogs/:blogId",
  handleAuthenticate,
  handleAuthorize(["admin", "user"]),
  getCommentByBlogIdValidation,
  handleValidationErrors,
  handleGetCommentsByBlogId
);

// POST /api/v1/comments/blogs/:blogId
router.post(
  "/blogs/:blogId",
  handleAuthenticate,
  handleAuthorize(["admin", "user"]),
  createCommentValidation,
  handleValidationErrors,
  handleCreateComment
);

// DELETE /api/v1/comments/:commentId
router.delete(
  "/:commentId",
  handleAuthenticate,
  handleAuthorize(["admin", "user"]),
  deleteCommentValidation,
  handleValidationErrors,
  handleDeleteComment
);

export default router;
