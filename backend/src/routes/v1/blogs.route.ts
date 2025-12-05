/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { Router } from "express";
import handleAuthenticate from "@/middlewares/authenticate.middleware";
import handleAuthorize from "@/middlewares/authorize.middleware";
import handleCreateBlog from "@/controllers/v1/blogs/create.controller";
import multer from "multer";
import handleBlogBannerImageUpload from "@/middlewares/upload.middleware";
import { body, query } from "express-validator";
import handleValidationErrors from "@/middlewares/validation-errors.middleware";
import handleGetAllBlogs from "@/controllers/v1/blogs/get-all.controller";

const router = Router();
const multerInstance = multer();

const createBlogValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required!")
    .isLength({ min: 3, max: 180 })
    .withMessage("Title must be between 3 and 180 characters!"),
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required!")
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters!"),
  body("status")
    .optional()
    .isIn(["draft", "published"])
    .withMessage("Status must be either 'draft' or 'published'"),
];

const getAllBlogsValidation = [
  query("limit")
    .optional()
    .toInt()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 and 50"),
  query("offset")
    .optional()
    .toInt()
    .isInt({ min: 0 })
    .withMessage("Offset must be a non-negative integer!"),
];

router.post(
  "/",
  handleAuthenticate,
  handleAuthorize(["admin"]),
  // parse multipart/form-data and extract file
  // must come before validation
  multerInstance.single("banner-image"),
  createBlogValidation,
  handleValidationErrors,
  // upload file to Cloudinary, attach banner to req.body
  // must come after validation but before controller
  handleBlogBannerImageUpload("post"),
  handleCreateBlog
);

// GET /api/v1/blogs
router.get(
  "/",
  handleAuthenticate,
  handleAuthorize(["admin", "user"]),
  getAllBlogsValidation,
  handleValidationErrors,
  handleGetAllBlogs
);

export default router;
