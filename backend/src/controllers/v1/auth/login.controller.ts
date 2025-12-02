/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import configs from "@/configs";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import logger from "@/lib/winston";
import RefreshToken from "@/models/RefreshToken";
import User, { type UserInterface } from "@/models/User";
import type { Request, Response } from "express";
import ms from "ms";
import { compare } from "bcryptjs";

type UserData = Pick<UserInterface, "email" | "password">;

export default async function handleLogin(req: Request, res: Response) {
  try {
    const { email, password } = req.body as UserData;

    // find user and explicitly select the password field because it is excluded by default
    const user = await User.findOne({ email })
      .select("+password")
      .lean()
      .exec();

    if (!user) {
      return res.status(401).json({
        code: "AuthenticationError",
        message: "Invalid email or password!",
      });
    }

    // verify password
    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        code: "AuthenticationError",
        message: "Invalid email or password!",
      });
    }

    // handle tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    const refreshTokenExpires = new Date(
      Date.now() + ms(configs.JWT_REFRESH_EXPIRES_IN)
    );

    // store refresh token in database
    await RefreshToken.create({
      token: refreshToken,
      userId: user._id,
      expiresAt: refreshTokenExpires,
    });

    logger.info("Refresh token created for user", {
      userId: user._id,
      expiresAt: refreshTokenExpires,
    });

    // set HTTP-only cookie
    res.cookie("refresh-token", refreshToken, {
      secure: configs.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
      maxAge: ms(configs.JWT_REFRESH_EXPIRES_IN),
    });

    // send response
    res.status(200).json({
      message: "User logged in successfully!",
      user: {
        role: user.role,
        username: user.username,
        email: user.email,
      },
      accessToken,
    });

    logger.info("User logged in successfully!", {
      userId: user._id,
      email: user.email,
    });
  } catch (error) {
    logger.error("Error logging in user:", error);
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error!",
    });
  }
}
