/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { quillStackApi } from "@/api";
import type { CommentDocument, PaginatedResponse } from "@/types";
import { AxiosError } from "axios";
import { data, redirect, type LoaderFunction } from "react-router";
import { toast } from "sonner";

const commentsLoader: LoaderFunction = async ({ request }) => {
  const user = localStorage.getItem("user");
  const accessToken = localStorage.getItem("access-token");

  if (!user || !accessToken) {
    toast.error("Looks like you've been signed out.", {
      position: "top-center",
      duration: 5000,
    });

    return redirect("/");
  }

  const url = new URL(request.url);

  try {
    const response = await quillStackApi.get("/comments", {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: Object.fromEntries(url.searchParams.entries()),
    });
    const responseData = response.data as PaginatedResponse<
      CommentDocument,
      "comments"
    >;

    return responseData;
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

export default commentsLoader;
