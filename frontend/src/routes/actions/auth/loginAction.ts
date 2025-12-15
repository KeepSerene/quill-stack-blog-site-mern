/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { quillStackApi } from "@/api";
import type { ActionFunction } from "react-router";
import type { ActionResponse, AuthResponse } from "@/types";
import { AxiosError } from "axios";

const loginAction: ActionFunction = async ({ request }) => {
  try {
    const loginFormData = await request.json();
    const response = await quillStackApi.post("/auth/login", loginFormData, {
      withCredentials: true,
    });
    const responseData = response.data as AuthResponse;

    localStorage.setItem("access-token", responseData.accessToken);
    localStorage.setItem("user", JSON.stringify(responseData.user));

    return {
      ok: true,
      data: responseData,
    } as ActionResponse<AuthResponse>;
  } catch (err) {
    if (err instanceof AxiosError) {
      console.error("Error logging in user:", err);

      return {
        ok: false,
        error: err.response?.data,
      };
    }

    throw err;
  }
};

export default loginAction;
