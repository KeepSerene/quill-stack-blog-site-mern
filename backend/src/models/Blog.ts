/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { generateSlug } from "@/utils";
import { model, Schema, Types } from "mongoose";

export interface BlogDocument {
  title: string;
  author: Types.ObjectId;
  content: string;
  slug: string;
  banner: {
    width: number;
    height: number;
    url: string;
    publicId: string;
  };
  viewCount: number;
  likeCount: number;
  commentCount: number;
  status: "draft" | "published";
}

const blogSchema = new Schema<BlogDocument>(
  {
    title: {
      type: String,
      required: [true, "Title is required!"],
      minlength: [3, "Title must be at least 3 characters!"],
      maxlength: [180, "Title cannot exceed 180 characters!"],
      trim: true,
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required!"],
    },

    content: {
      type: String,
      required: [true, "Content is required!"],
      minlength: [10, "Content must be at least 10 characters!"],
    },

    slug: {
      type: String,
      required: [true, "Slug is required!"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-z0-9\-]+$/,
        "Slug can only contain lowercase letters, numbers, and hyphens!",
      ],
    },

    banner: {
      width: { type: Number, required: [true, "Banner width is required!"] },
      height: { type: Number, required: [true, "Banner height is required!"] },
      url: { type: String, required: [true, "Banner URL is required!"] },
      publicId: {
        type: String,
        required: [true, "Banner public ID is required!"],
      },
    },

    viewCount: { type: Number, default: 0, min: 0 },
    likeCount: { type: Number, default: 0, min: 0 },
    commentCount: { type: Number, default: 0, min: 0 },

    status: {
      type: String,
      enum: {
        values: ["draft", "published"],
        message: "{VALUE} is not supported!",
      },
      default: "draft",
    },
  },
  {
    timestamps: {
      createdAt: "publishedAt",
      updatedAt: "editedAt",
    },
  }
);

// Validation: auto-generate slug from title if slug not provided
blogSchema.pre("validate", async function () {
  if (this.title && !this.slug) {
    this.slug = generateSlug(this.title);

    // handle duplicate slugs by appending random string
    const existingBlog = await model("Blog").findOne({ slug: this.slug });

    if (existingBlog) {
      this.slug = `${this.slug}-${Math.random().toString(36).substring(2, 8)}`;
    }
  }
});

export default model<BlogDocument>("Blog", blogSchema);
