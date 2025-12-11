/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { quillStackApi } from "@/api";
import type { Blog, PaginatedResponse } from "@/types";
import { AxiosError } from "axios";
import { data, redirect, type LoaderFunction } from "react-router";
import { toast } from "sonner";

export interface HomeLoaderResponse {
  allBlogsData: PaginatedResponse<Blog, "blogs">;
  recentBlogsData: PaginatedResponse<Blog, "blogs">;
}

const homeLoader: LoaderFunction = async () => {
  const accessToken = localStorage.getItem("access-token");

  if (!accessToken) {
    toast.error("Access token is missing!", {
      position: "top-center",
      duration: 5000,
    });

    return;
  }

  try {
    const { data: recentBlogsData } = await quillStackApi.get("/blogs", {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { limit: 4 },
    });

    const { data: allBlogsData } = await quillStackApi.get("/blogs", {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { limit: 12, offset: 4 },
    });

    return { allBlogsData, recentBlogsData } as HomeLoaderResponse;
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

export default homeLoader;
