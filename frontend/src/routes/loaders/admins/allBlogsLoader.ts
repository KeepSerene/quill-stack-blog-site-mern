/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type { BlogDocument, PaginatedResponse } from "@/types";
import { quillStackApi } from "@/api";
import { AxiosError } from "axios";
import { data, redirect, type LoaderFunction } from "react-router";
import { toast } from "sonner";

const allBlogsLoader: LoaderFunction = async ({ request }) => {
  const accessToken = localStorage.getItem("access-token");

  if (!accessToken) {
    toast.error("Access token is missing!", {
      position: "top-center",
      duration: 5000,
    });

    return redirect("/");
  }

  const url = new URL(request.url);
  const limit = url.searchParams.get("limit") || 10;
  const offset = url.searchParams.get("offset") || 0;

  try {
    const response = await quillStackApi.get("/blogs", {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { limit, offset },
    });
    const data = response.data as PaginatedResponse<BlogDocument, "blogs">;

    return data;
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

export default allBlogsLoader;
