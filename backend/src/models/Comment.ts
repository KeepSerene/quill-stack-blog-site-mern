/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { model, Schema, type Types } from "mongoose";

export interface CommentDocument {
  blogId: Types.ObjectId;
  userId: Types.ObjectId;
  content: string;
}

const commentSchema = new Schema<CommentDocument>(
  {
    blogId: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
      required: [true, "Blog ID is required!"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required!"],
    },
    content: {
      type: String,
      required: [true, "Content is required!"],
      trim: true,
      maxLength: [1000, "Content cannot exceed 1000 characters!"],
    },
  },
  { timestamps: true }
);

export default model("Comment", commentSchema);
