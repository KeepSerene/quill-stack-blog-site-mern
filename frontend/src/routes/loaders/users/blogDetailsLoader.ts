/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { quillStackApi } from "@/api";
import type { BlogDocument } from "@/types";
import { AxiosError } from "axios";
import { data, type LoaderFunction } from "react-router";

export interface blogDetailsResponse {
  message: string;
  blog: BlogDocument;
}

const blogDetailsLoader: LoaderFunction = async ({ params }) => {
  const accessToken = localStorage.getItem("access-token");
  const { slug } = params;

  try {
    const headers = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : {};

    const response = await quillStackApi.get(`/blogs/${slug}`, {
      headers,
    });

    return response.data as blogDetailsResponse;
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

export default blogDetailsLoader;
