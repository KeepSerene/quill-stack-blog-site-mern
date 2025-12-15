/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { quillStackApi } from "@/api";
import { redirect, type ActionFunction } from "react-router";
import type { ActionResponse } from "@/types";
import { AxiosError } from "axios";
import { toast } from "sonner";

const blogsAction: ActionFunction = async ({ request }) => {
  const accessToken = localStorage.getItem("access-token");

  if (!accessToken) {
    toast.error("Access token is missing!", {
      position: "top-center",
      duration: 5000,
    });

    return redirect("/");
  }

  try {
    const data = (await request.json()) as { blogId: string };
    const response = await quillStackApi.delete(`/blogs/id/${data.blogId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return {
      ok: true,
      data: response.data,
    } as ActionResponse;
  } catch (err) {
    if (err instanceof AxiosError) {
      console.error("Error in blogs action:", err);

      return {
        ok: false,
        error: err.response?.data,
      };
    }

    throw err;
  }
};

export default blogsAction;
