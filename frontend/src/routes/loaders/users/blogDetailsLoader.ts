/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { quillStackApi } from "@/api";
import type { BlogDocument } from "@/types";
import { AxiosError } from "axios";
import { data, redirect, type LoaderFunction } from "react-router";
import { toast } from "sonner";

export interface blogDetailsResponse {
  message: string;
  blog: BlogDocument;
}

const blogDetailsLoader: LoaderFunction = async ({ params }) => {
  const accessToken = localStorage.getItem("access-token");

  if (!accessToken) {
    toast.error("Access token is missing!", {
      position: "top-center",
      duration: 5000,
    });

    return;
  }

  const { slug } = params;

  try {
    const { data } = await quillStackApi.get(`/blogs/${slug}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return data as blogDetailsResponse;
  } catch (error) {
    if (error instanceof AxiosError) {
      const hasTokenExpired = error.response?.data.message.includes("expired");

      if (hasTokenExpired) {
        localStorage.removeItem("access-token");
        localStorage.removeItem("user");

        return redirect("/refresh-token");
      }

      throw data(error.response?.data.message || error.message, {
        status: error.response?.status || error.status,
        statusText: error.response?.data.code || error.code,
      });
    }

    throw error;
  }
};

export default blogDetailsLoader;
