/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { quillStackApi } from "@/api";
import { redirect, type ActionFunction } from "react-router";
import type { ActionResponse, CreateBlogResponse } from "@/types";
import { AxiosError } from "axios";
import { toast } from "sonner";

const blogCreateAction: ActionFunction = async ({ request }) => {
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
    const response = await quillStackApi.post("/blogs", formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Encoding": "multipart/form-data",
      },
    });
    const responseData = response.data as CreateBlogResponse;

    return {
      ok: true,
      data: responseData,
    } as ActionResponse<CreateBlogResponse>;
  } catch (err) {
    if (err instanceof AxiosError) {
      console.error("Error in blog create action:", err);

      return {
        ok: false,
        error: err.response?.data,
      };
    }

    throw err;
  }
};

export default blogCreateAction;
