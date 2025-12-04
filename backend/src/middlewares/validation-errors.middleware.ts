/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export default function handleValidationErrors(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      code: "ValidationError",
      message: errors.array()[0].msg,
      errors: errors.mapped(),
    });
  }

  next();
}
