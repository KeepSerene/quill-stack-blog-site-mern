/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import configs from "@/configs";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import logger from "./winston";

const cloudName = configs.CLOUDINARY_CLOUD_NAME;
const apiKey = configs.CLOUDINARY_API_KEY;
const apiSecret = configs.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  throw new Error("One or more Cloudinary credentials are missing!");
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: configs.NODE_ENV === "production",
});

/**
 * Uploads an image buffer to Cloudinary
 *
 * @param buffer - Image file buffer from multer
 * @param publicId - Optional public ID for replacing existing images
 * @returns Upload response with image URL and metadata, or undefined on failure
 */
export default async function uploadToCloudinary(
  buffer: Buffer<ArrayBufferLike>,
  publicId?: string
): Promise<UploadApiResponse | undefined> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      // start streaming upload
      .upload_stream(
        {
          public_id: publicId,
          allowed_formats: ["jpg", "png", "webp"],
          resource_type: "image",
          transformation: { quality: "auto" },
          folder: "quill-stack-banners",
        },
        // called when upload completes (success or error)
        (err, result) => {
          if (err) {
            logger.error("Cloudinary upload stream error", {
              errorCode: err.error?.code,
              errorMessage: err.error?.message || err.message,
              publicId: publicId || "auto-generated",
              httpCode: err.http_code,
            });
            reject(err);
          }

          resolve(result);
        }
      )
      .end(buffer); // send data and close stream
  });
}
