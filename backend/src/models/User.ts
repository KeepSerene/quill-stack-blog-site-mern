/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { model, Schema } from "mongoose";

export interface UserInterface {
  role: "admin" | "user";
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  socialLinks?: {
    website?: string;
    gitHub?: string;
    linkedIn?: string;
    x?: string;
    instagram?: string;
    meta?: string;
    youTube?: string;
  };
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// allow alphanumeric, underscore, and hyphen only
const usernameRegex = /^[a-zA-Z0-9_-]+$/;

const userSchema = new Schema<UserInterface>(
  {
    role: {
      type: String,
      required: [true, "Role is required!"],
      enum: {
        values: ["user", "admin"],
        message: "{VALUE} is not supported!",
      },
      default: "user",
    },
    username: {
      type: String,
      required: [true, "Username is required!"],
      unique: true,
      minLength: [2, "Username must be at least 2 characters!"],
      maxLength: [20, "Username cannot exceed 20 characters!"],
      validate: {
        validator: function (value: string) {
          return usernameRegex.test(value);
        },
        message:
          "Username can only contain letters, numbers, underscores, and hyphens!",
      },
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: true,
      lowercase: true,
      trim: true,
      maxLength: [50, "Email cannot exceed 50 characters!"],
      validate: {
        validator: function (value: string) {
          return emailRegex.test(value);
        },
        message: "Please provide a valid email address!",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      minLength: [8, "Password must be at least 8 characters!"],
      select: false,
    },
    firstName: {
      type: String,
      trim: true,
      minLength: [2, "First name must be at least 2 characters!"],
      maxLength: [20, "First name cannot exceed 20 characters!"],
    },
    lastName: {
      type: String,
      trim: true,
      minLength: [2, "Last name must be at least 2 characters!"],
      maxLength: [20, "Last name cannot exceed 20 characters!"],
    },
    socialLinks: {
      website: {
        type: String,
        trim: true,
        maxLength: [100, "Website address cannot exceed 100 characters!"],
      },
      gitHub: {
        type: String,
        trim: true,
        maxLength: [100, "GitHub profile URL cannot exceed 100 characters!"],
      },
      linkedIn: {
        type: String,
        trim: true,
        maxLength: [100, "LinkedIn profile URL cannot exceed 100 characters!"],
      },
      x: {
        type: String,
        trim: true,
        maxLength: [100, "X profile URL cannot exceed 100 characters!"],
      },
      instagram: {
        type: String,
        trim: true,
        maxLength: [100, "Instagram profile URL cannot exceed 100 characters!"],
      },
      meta: {
        type: String,
        trim: true,
        maxLength: [100, "Meta profile URL cannot exceed 100 characters!"],
      },
      youTube: {
        type: String,
        trim: true,
        maxLength: [100, "YouTube channel URL cannot exceed 100 characters!"],
      },
    },
  },
  { timestamps: true }
);

export default model<UserInterface>("User", userSchema);
