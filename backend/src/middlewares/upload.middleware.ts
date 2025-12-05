/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type { NextFunction, Request, Response } from "express";
import Blog from "@/models/Blog";
import uploadToCloudinary from "@/lib/cloudinary";
import logger from "@/lib/winston";
import type { UploadApiErrorResponse } from "cloudinary";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

/**
 * Middleware to handle blog banner image upload to Cloudinary
 *
 * Flow:
 * 1. Check if file exists in request (required for POST, optional for PUT)
 * 2. Validate file size (max 2MB)
 * 3. Upload file buffer to Cloudinary
 * 4. Attach banner metadata to req.body for next middleware/controller
 *
 * @param method - HTTP method ('post' or 'put') to determine file requirement
 */
export default function handleBlogBannerImageUpload(method: "post" | "put") {
  return async (req: Request, res: Response, next: NextFunction) => {
    // If it's an update (PUT) and no file was uploaded, skip image handling
    if (method === "put" && !req.file) return next();

    if (!req.file) {
      return res.status(400).json({
        code: "ValidationError",
        message: "Blog banner image file is required!",
      });
    }

    if (req.file.size > MAX_FILE_SIZE) {
      return res.status(413).json({
        code: "ValidationError",
        message: "Max allowed image file size is 2MB!",
      });
    }

    try {
      const blogId = req.params.blogId; // may be undefined for POST

      // For PUT: we need the existing blog to obtain its current publicId so Cloudinary can replace the image
      // For POST: we are creating a new blog and should NOT try to fetch any blog document
      let publicIdToUse: string | undefined = undefined;

      if (method === "put") {
        if (!blogId) {
          return res.status(400).json({
            code: "ValidationError",
            message: "Blog ID is required to update banner image!",
          });
        }

        // find blog to get existing publicId (to replace image in Cloudinary)
        const blog = await Blog.findById(blogId)
          .select("banner.publicId")
          .exec();

        if (!blog) {
          return res.status(404).json({
            code: "NotFound",
            message: "Blog not found!",
          });
        }

        // prepare publicId for replacement (strip folder prefix if any)
        publicIdToUse = blog.banner.publicId
          ? blog.banner.publicId.replace(/^quill-stack-banners\//, "")
          : undefined;
      } else {
        // POST case: do not look up any blog; let Cloudinary auto-generate a new public ID.
        publicIdToUse = undefined;
      }

      const data = await uploadToCloudinary(req.file.buffer, publicIdToUse);

      // handle upload failure
      if (!data) {
        logger.error(
          "Cloudinary upload returned undefined - possible stream error",
          {
            fileSize: req.file.size,
            mimeType: req.file.mimetype,
            blogId,
          }
        );

        return res.status(500).json({
          code: "ServerError",
          message: "Image upload failed. Please try again!",
        });
      }

      // build the new banner metadata to attach to req.body for downstream controllers
      const newBanner = {
        publicId: data.public_id,
        url: data.secure_url,
        width: data.width,
        height: data.height,
      };

      logger.info("Blog banner uploaded successfully to Cloudinary", {
        publicId: data.public_id,
        dimensions: `${data.width}x${data.height}`,
        blogId,
      });

      // this will be picked up by the create/update controller
      req.body.banner = newBanner;

      return next();
    } catch (error: UploadApiErrorResponse | any) {
      logger.error("Cloudinary upload failed", {
        errorName: error.name,
        errorMessage: error.message,
        httpCode: error.http_code,
        fileSize: req.file?.size,
        mimeType: req.file?.mimetype,
      });

      return res.status(error.http_code || 500).json({
        code:
          error.http_code && error.http_code < 500
            ? "ValidationError"
            : "ServerError",
        message: error.message || "Image upload failed. Please try again!",
      });
    }
  };
}
