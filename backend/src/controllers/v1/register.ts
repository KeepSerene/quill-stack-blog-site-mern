/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import User, { UserInterface } from "@/models/User";
import type { Request, Response } from "express";
import { generateUsername } from "@/utils";
import logger from "@/lib/winston";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import configs from "@/configs";

type UserData = Pick<UserInterface, "role" | "email" | "password">;

export default async function handleRegister(req: Request, res: Response) {
  const { role, email, password } = req.body as UserData;

  try {
    const username = generateUsername();
    const newUser = await User.create({
      role,
      username,
      email,
      password,
    });

    // handle access and refresh tokens
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    // set cookie
    res.cookie("refresh-token", refreshToken, {
      secure: configs.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
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
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error!",
      error,
    });
    logger.error("Error registering user:", error);
  }
}
