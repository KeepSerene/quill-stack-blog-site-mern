/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { model, Schema, Types } from "mongoose";

interface RefreshTokenInterface {
  token: string;
  userId: Types.ObjectId;
  expiresAt: Date;
}

const refreshTokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      // TTL index - MongoDB automatically deletes expired tokens
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

export default model<RefreshTokenInterface>("RefreshToken", refreshTokenSchema);
