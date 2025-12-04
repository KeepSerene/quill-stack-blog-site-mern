/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { Router } from "express";
import { body, cookie } from "express-validator";
import handleValidationErrors from "@/middlewares/validation-errors.middleware";
import handleRegister from "@/controllers/v1/auth/register.controller";
import handleLogin from "@/controllers/v1/auth/login.controller";
import handleRefreshToken from "@/controllers/v1/auth/refresh-token.controller";
import handleLogout from "@/controllers/v1/auth/logout.controller";
import handleAuthenticate from "@/middlewares/authenticate.middleware";

const router = Router();

const registerValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required!")
    .isEmail()
    .withMessage("Please provide a valid email address!")
    .normalizeEmail()
    .isLength({ max: 50 })
    .withMessage("Email cannot exceed 50 characters!"),
  body("password")
    .notEmpty()
    .withMessage("Password is required!")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters!")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number!"
    ),
  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role must be either 'user' or 'admin'!"),
];

const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required!")
    .isEmail()
    .withMessage("Please provide a valid email address!")
    .isLength({ max: 50 })
    .withMessage("Email cannot exceed 50 characters!")
    .normalizeEmail(),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required!")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters!"),
];

const refreshTokenValidation = cookie("refresh-token")
  .trim()
  .notEmpty()
  .withMessage("Refresh token is required!")
  .isJWT()
  .withMessage("Invalid refresh token!");

// POST /api/v1/auth/register
router.post(
  "/register",
  registerValidation,
  handleValidationErrors,
  handleRegister
);

// POST /api/v1/auth/login
router.post("/login", loginValidation, handleValidationErrors, handleLogin);

// POST /api/v1/auth/refresh-token
router.post(
  "/refresh-token",
  refreshTokenValidation,
  handleValidationErrors,
  handleRefreshToken
);

// POST /api/v1/auth/logout
router.post("/logout", handleAuthenticate, handleLogout);

export default router;
