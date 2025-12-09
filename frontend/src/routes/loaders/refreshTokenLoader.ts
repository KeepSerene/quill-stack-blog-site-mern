/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { data, redirect, type LoaderFunction } from "react-router";
import { quillStackApi } from "@/api";
import { AxiosError } from "axios";

const refreshTokenLoader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const redirectUri = url.searchParams.get("redirect") ?? "/";

  try {
    const { data } = await quillStackApi.post(
      "/auth/refresh-token",
      {},
      { withCredentials: true }
    );
    localStorage.setItem("access-token", data.accessToken);

    return redirect(redirectUri);
  } catch (error) {
    if (error instanceof AxiosError) {
      const hasTokenExpired = error.response?.data.message.includes("expired");

      if (hasTokenExpired) {
        localStorage.removeItem("access-token");
        localStorage.removeItem("user");

        return redirect("/login");
      }

      throw data(error.response?.data.message || error.message, {
        status: error.response?.status || error.status,
        statusText: error.response?.data.code || error.code,
      });
    }

    throw error;
  }
};

export default refreshTokenLoader;
