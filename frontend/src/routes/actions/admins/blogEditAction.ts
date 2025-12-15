/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { quillStackApi } from "@/api";
import { redirect, type ActionFunction } from "react-router";
import type { ActionResponse } from "@/types";
import { AxiosError } from "axios";
import { toast } from "sonner";

const blogEditAction: ActionFunction = async ({ request, params }) => {
  const slug = params.slug;

  const accessToken = localStorage.getItem("access-token");

  if (!accessToken) {
    toast.error("Access token is missing!", {
      position: "top-center",
      duration: 5000,
    });

    return redirect("/");
  }

  try {
    const formData = await request.formData();
    const response = await quillStackApi.put(`/blogs/${slug}`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Encoding": "multipart/form-data",
      },
    });

    return {
      ok: true,
      data: response.data,
    } as ActionResponse;
  } catch (err) {
    if (err instanceof AxiosError) {
      console.error("Error in blog edit action:", err);

      return {
        ok: false,
        error: err.response?.data,
      };
    }

    throw err;
  }
};

export default blogEditAction;
