/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { model, Schema, type Types } from "mongoose";

interface LikeDocument {
  blogId?: Types.ObjectId;
  userId: Types.ObjectId;
  commentId?: Types.ObjectId;
}

const likeSchema = new Schema<LikeDocument>(
  {
    blogId: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required!"],
    },
    commentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  },
  { timestamps: true }
);

// Compound index: ensures a user can only like a blog/comment once
// Also improves query performance when checking existing likes
likeSchema.index({ blogId: 1, userId: 1 }, { unique: true, sparse: true });
likeSchema.index({ commentId: 1, userId: 1 }, { unique: true, sparse: true });

// Validation: must have either blogId or commentId, but not both
likeSchema.pre("validate", function () {
  const hasBlogId = !!this.blogId;
  const hasCommentId = !!this.commentId;

  if (!hasBlogId && !hasCommentId) {
    throw new Error("Either blogId or commentId must be provided!");
  }

  if (hasBlogId && hasCommentId) {
    throw new Error("Cannot like both a blog and a comment simultaneously!");
  }
});

export default model<LikeDocument>("Like", likeSchema);
