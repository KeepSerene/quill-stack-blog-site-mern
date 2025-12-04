/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type { NextFunction, Request, Response } from "express";
import User from "@/models/User";
import logger from "@/lib/winston";

type UserRole = "admin" | "user";

export default function handleAuthorize(roles: UserRole[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    try {
      const user = await User.findById(userId).select("role").exec();

      if (!user) {
        return res.status(404).json({
          code: "NotFound",
          message: "User not found!",
        });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({
          code: "AuthorizationError",
          message: "Access denied, insufficient permissions!",
        });
      }

      return next();
    } catch (error) {
      logger.error("Error authorizing user:", error);
      res.status(500).json({
        code: "ServerError",
        message: "Internal server error!",
      });
    }
  };
}
