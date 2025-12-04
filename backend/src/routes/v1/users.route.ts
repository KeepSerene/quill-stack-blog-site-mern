/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { Router } from "express";
import { body, param, query } from "express-validator";
import handleAuthenticate from "@/middlewares/authenticate.middleware";
import handleAuthorize from "@/middlewares/authorize.middleware";
import handleValidationErrors from "@/middlewares/validation-errors.middleware";
import handleGetAllUsers from "@/controllers/v1/users/get-all.controller";
import handleGetUserById from "@/controllers/v1/users/get-by-id.controller";
import handleDeleteUserById from "@/controllers/v1/users/delete-by-id.controller";
import handleGetCurrentUser from "@/controllers/v1/users/get-current.controller";
import handleUpdateCurrentUser from "@/controllers/v1/users/update-current.controller";
import User from "@/models/User";
import handleDeleteCurrentUser from "@/controllers/v1/users/delete-current.controller";

const router = Router();

const getAllUsersValidation = [
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Query limit must be between 1 and 50."),
  query("offset")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Query offset must be a positive integer!"),
];

const userByIdValidation = param("userId")
  .notEmpty()
  .isMongoId()
  .withMessage("Invalid user ID!");

const updateUserValidation = [
  body("username")
    .optional()
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage("Username must be between 2 and 20 characters!")
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(
      "Username can only contain letters, numbers, underscores, and hyphens!"
    )
    .custom(async (value) => {
      if (!value) return true;

      const userExists = await User.exists({ username: value });

      if (userExists) {
        throw new Error("Username is already taken!");
      }

      return true;
    }),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address!")
    .normalizeEmail()
    .isLength({ max: 50 })
    .withMessage("Email cannot exceed 50 characters!")
    .custom(async (value) => {
      if (!value) return true;

      const userExists = await User.exists({ email: value });

      if (userExists) {
        throw new Error("Email is already in use!");
      }

      return true;
    }),
  body("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters!")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number!"
    ),
  body("firstName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage("First name must be between 2 and 20 characters!"),
  body("lastName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage("Last name must be between 2 and 20 characters!"),
  body([
    "websiteUrl",
    "gitHubUrl",
    "linkedInUrl",
    "xUrl",
    "youTubeUrl",
    "metaUrl",
    "instagramUrl",
  ])
    .optional()
    .trim()
    .isURL()
    .withMessage("Please provide a valid URL!")
    .isLength({ max: 100 })
    .withMessage("URL cannot exceed 100 characters!"),
];

/**
 * Admin routes
 */

// GET /api/v1/users
router.get(
  "/",
  handleAuthenticate,
  handleAuthorize(["admin"]),
  getAllUsersValidation,
  handleValidationErrors,
  handleGetAllUsers
);

// GET /api/v1/users/:userId
router.get(
  "/:userId",
  handleAuthenticate,
  handleAuthorize(["admin"]),
  userByIdValidation,
  handleValidationErrors,
  handleGetUserById
);

// DELETE /api/v1/users/:userId
router.delete(
  "/:userId",
  handleAuthenticate,
  handleAuthorize(["admin"]),
  userByIdValidation,
  handleValidationErrors,
  handleDeleteUserById
);

/**
 * All users routes
 */

// GET /api/v1/users/current
router.get(
  "/current",
  handleAuthenticate,
  handleAuthorize(["admin", "user"]),
  handleGetCurrentUser
);

// PUT /api/v1/users/current
router.put(
  "/current",
  handleAuthenticate,
  handleAuthorize(["admin", "user"]),
  updateUserValidation,
  handleValidationErrors,
  handleUpdateCurrentUser
);

// DELETE /api/v1/users/current
router.delete(
  "/current",
  handleAuthenticate,
  handleAuthorize(["admin", "user"]),
  handleDeleteCurrentUser
);

export default router;
