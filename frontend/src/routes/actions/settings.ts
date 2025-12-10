/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { quillStackApi } from "@/api";
import { AxiosError } from "axios";
import { redirect, type ActionFunction } from "react-router";
import { toast } from "sonner";

const settingsAction: ActionFunction = async ({ request }) => {
  const accessToken = localStorage.getItem("access-token");

  if (!accessToken) {
    toast.error("Access Token is missing!", {
      position: "top-center",
      duration: 5000,
    });

    return redirect("/");
  }

  try {
    const formData = await request.json();
    const response = await quillStackApi.put("/users/current", formData, {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true,
    });
    const responseData = response.data;

    // store updated user
    localStorage.setItem("user", JSON.stringify(responseData.user));

    return {
      ok: true,
      data: responseData,
    };
  } catch (err) {
    if (err instanceof AxiosError) {
      console.error("Error updating changes:", err);
      toast.error("Failed to update changes!", {
        position: "top-center",
        duration: 5000,
      });

      return {
        ok: false,
        error: err.response?.data,
      };
    }

    throw err;
  }
};

export default settingsAction;
