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
import { body, param, query } from "express-validator";
import handleValidationErrors from "@/middlewares/validation-errors.middleware";
import handleGetAllBlogs from "@/controllers/v1/blogs/get-all.controller";
import handleGetBlogBySlug from "@/controllers/v1/blogs/get-by-slug.controller";
import handleUpdateBlogById from "@/controllers/v1/blogs/update-by-id.controller";
import handleDeleteBlogById from "@/controllers/v1/blogs/delete-by-id.controller";
import handleUpdateBlogBySlug from "@/controllers/v1/blogs/update-by-slug.controller";
import handleDeleteBlogBySlug from "@/controllers/v1/blogs/delete-by-slug.controller";

const router = Router();
const multerInstance = multer();

// Express validator middlewares
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

const getBlogBySlugValidation = [
  param("slug")
    .exists({ checkFalsy: true })
    .withMessage("Slug is required!")
    .isString()
    .withMessage("Slug must be a string!")
    .trim()
    .matches(/^[a-z0-9\-]+$/)
    .withMessage(
      "Slug can only contain lowercase letters, numbers, and hyphens!"
    ),
];

const updateBlogByIdValidation = [
  param("blogId").isMongoId().withMessage("Invalid blog ID!"),
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title is required!")
    .isLength({ min: 3, max: 180 })
    .withMessage("Title must be between 3 and 180 characters!"),
  body("content")
    .optional()
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

const updateBlogBySlugValidation = [
  param("slug")
    .exists({ checkFalsy: true })
    .withMessage("Slug is required!")
    .isString()
    .withMessage("Slug must be a string!")
    .trim()
    .matches(/^[a-z0-9\-]+$/)
    .withMessage(
      "Slug can only contain lowercase letters, numbers, and hyphens!"
    ),
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title is required!")
    .isLength({ min: 3, max: 180 })
    .withMessage("Title must be between 3 and 180 characters!"),
  body("content")
    .optional()
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

const deleteBlogByIdValidation = param("blogId")
  .isMongoId()
  .withMessage("Invalid blog ID!");

const deleteBlogBySlugValidation = getBlogBySlugValidation;

// POST /api/v1/blogs
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

// GET /api/v1/blogs/:slug
router.get(
  "/:slug",
  handleAuthenticate,
  handleAuthorize(["admin", "user"]),
  getBlogBySlugValidation,
  handleValidationErrors,
  handleGetBlogBySlug
);

// PUT /api/v1/blogs/id/:blogId
router.put(
  "/id/:blogId",
  handleAuthenticate,
  handleAuthorize(["admin"]),
  multerInstance.single("banner-image"),
  updateBlogByIdValidation,
  handleValidationErrors,
  handleBlogBannerImageUpload("put"),
  handleUpdateBlogById
);

// PUT /api/v1/blogs/:slug
router.put(
  "/:slug",
  handleAuthenticate,
  handleAuthorize(["admin"]),
  multerInstance.single("banner-image"),
  updateBlogBySlugValidation,
  handleValidationErrors,
  handleBlogBannerImageUpload("put"),
  handleUpdateBlogBySlug
);

// DELETE /api/v1/blogs/id/:blogId
router.delete(
  "/id/:blogId",
  handleAuthenticate,
  handleAuthorize(["admin"]),
  deleteBlogByIdValidation,
  handleValidationErrors,
  handleDeleteBlogById
);

// DELETE /api/v1/blogs/:slug
router.delete(
  "/:slug",
  handleAuthenticate,
  handleAuthorize(["admin"]),
  deleteBlogBySlugValidation,
  handleValidationErrors,
  handleDeleteBlogBySlug
);

export default router;
