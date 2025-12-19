/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { quillStackApi } from "@/api";
import type { BlogDocument, PaginatedResponse } from "@/types";
import { AxiosError } from "axios";
import { data, redirect, type LoaderFunction } from "react-router";

export interface HomeLoaderResponse {
  allBlogsData: PaginatedResponse<BlogDocument, "blogs">;
  recentBlogsData: PaginatedResponse<BlogDocument, "blogs">;
}

const homeLoader: LoaderFunction = async () => {
  const accessToken = localStorage.getItem("access-token");

  try {
    const headers = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : {};

    const [{ data: recentBlogsData }, { data: allBlogsData }] =
      await Promise.all([
        quillStackApi.get("/blogs", {
          headers,
          params: { limit: 4 },
        }),
        quillStackApi.get("/blogs", {
          headers,
          params: { limit: 12, offset: 4 },
        }),
      ]);

    return { allBlogsData, recentBlogsData } as HomeLoaderResponse;
  } catch (error) {
    if (error instanceof AxiosError) {
      const hasTokenExpired = error.response?.data.message?.includes("expired");

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
