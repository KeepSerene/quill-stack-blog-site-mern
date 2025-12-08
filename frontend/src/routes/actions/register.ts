/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { quillStackApi } from "@/api";
import type { ActionFunction } from "react-router";
import type { ActionResponse, AuthResponse } from "@/types";
import { AxiosError } from "axios";

const registerAction: ActionFunction = async ({ request }) => {
  try {
    const registerFormData = await request.json();
    const response = await quillStackApi.post(
      "/auth/register",
      registerFormData,
      { withCredentials: true }
    );
    const responseData = response.data as AuthResponse;

    localStorage.setItem("accessToken", responseData.accessToken);
    localStorage.setItem("user", JSON.stringify(responseData.user));

    return {
      ok: true,
      data: responseData,
    } as ActionResponse<AuthResponse>;
  } catch (err) {
    if (err instanceof AxiosError) {
      console.error("Error registering user:", err);

      return {
        ok: false,
        error: err.response?.data,
      };
    }

    throw err;
  }
};

export default registerAction;
