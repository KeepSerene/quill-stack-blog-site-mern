/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { quillStackApi } from "@/api";
import type { BlogDocument, PaginatedResponse } from "@/types";
import { AxiosError } from "axios";
import { data, type LoaderFunction } from "react-router";

const blogsLoader: LoaderFunction = async ({ request }) => {
  const accessToken = localStorage.getItem("access-token");
  const url = new URL(request.url);

  try {
    const headers = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : {};

    const response = await quillStackApi.get("/blogs", {
      headers,
      params: Object.fromEntries(url.searchParams),
    });
    const responseData = response.data as PaginatedResponse<
      BlogDocument,
      "blogs"
    >;

    return responseData;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw data(error.response?.data.message || error.message, {
        status: error.response?.status || error.status,
        statusText: error.response?.data.code || error.code,
      });
    }

    throw error;
  }
};

export default blogsLoader;
