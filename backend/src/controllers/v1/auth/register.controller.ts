/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import User, { type UserInterface } from "@/models/User";
import type { Request, Response } from "express";
import { generateUsername } from "@/utils";
import logger from "@/lib/winston";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import configs from "@/configs";
import RefreshToken from "@/models/RefreshToken";
import ms from "ms";

type UserData = Pick<UserInterface, "role" | "email" | "password">;

export default async function handleRegister(req: Request, res: Response) {
  const { role, email, password } = req.body as UserData;

  if (role === "admin" && !configs.WHITELISTED_ADMIN_EMAILS.includes(email)) {
    logger.error(
      `User with email "${email}" tried to register as an admin, but is not whitelisted!`
    );

    return res.status(403).json({
      code: "AuthorizationError",
      message: "You cannot register as an admin!",
    });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        code: "DuplicateUser",
        message: "User with this email already exists!",
      });
    }

    const username = generateUsername();
    const newUser = await User.create({
      role: role || "user",
      username,
      email,
      password,
    });

    // handle access and refresh tokens
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    const refreshTokenExpires = new Date(
      Date.now() + ms(configs.JWT_REFRESH_EXPIRES_IN)
    );

    await RefreshToken.create({
      token: refreshToken,
      userId: newUser._id,
      expiresAt: refreshTokenExpires,
    });

    logger.info("Refresh token created for user", {
      userId: newUser._id,
      expiresAt: refreshTokenExpires,
    });

    // set HTTP-only cookie
    res.cookie("refresh-token", refreshToken, {
      secure: configs.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
      maxAge: ms(configs.JWT_REFRESH_EXPIRES_IN),
    });

    // final response
    res.status(201).json({
      message: "New user created!",
      user: {
        role: newUser.role,
        username: newUser.username,
        email: newUser.email,
      },
      accessToken,
    });

    logger.info("User registered successfully!", {
      role: newUser.role,
      username: newUser.username,
      email: newUser.email,
    });
  } catch (error) {
    logger.error("Error registering user:", error);
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error!",
    });
  }
}
