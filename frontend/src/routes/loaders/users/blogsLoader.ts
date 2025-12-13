/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { quillStackApi } from "@/api";
import type { BlogDocument, PaginatedResponse } from "@/types";
import { AxiosError } from "axios";
import { data, redirect, type LoaderFunction } from "react-router";
import { toast } from "sonner";

const blogsLoader: LoaderFunction = async ({ request }) => {
  const accessToken = localStorage.getItem("access-token");

  if (!accessToken) {
    toast.error("Access token is missing!", {
      position: "top-center",
      duration: 5000,
    });

    return;
  }

  const url = new URL(request.url);

  try {
    const response = await quillStackApi.get("/blogs", {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: Object.fromEntries(url.searchParams),
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

export default blogsLoader;
