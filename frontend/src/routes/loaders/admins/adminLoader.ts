/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type { UserDocument } from "@/types";
import { quillStackApi } from "@/api";
import { AxiosError } from "axios";
import { data, redirect, type LoaderFunction } from "react-router";
import { toast } from "sonner";

export interface AdminLoaderResponse {
  message: string;
  user: UserDocument;
}

const adminLoader: LoaderFunction = async () => {
  const accessToken = localStorage.getItem("access-token");

  if (!accessToken) {
    toast.error("Access token is missing!", {
      position: "top-center",
      duration: 5000,
    });

    return redirect("/");
  }

  try {
    const response = await quillStackApi.get("/users/current", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const data = response.data as AdminLoaderResponse;

    if (data.user.role !== "admin") return redirect("/");

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

export default adminLoader;
