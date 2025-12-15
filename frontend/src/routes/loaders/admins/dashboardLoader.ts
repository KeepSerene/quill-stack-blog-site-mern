/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type {
  BlogDocument,
  CommentDocument,
  PaginatedResponse,
  UserDocument,
} from "@/types";
import { quillStackApi } from "@/api";
import { AxiosError } from "axios";
import { data, redirect, type LoaderFunction } from "react-router";
import { toast } from "sonner";

export interface DashboardLoaderResponse {
  users: UserDocument[];
  blogs: BlogDocument[];
  comments: CommentDocument[];
  userCount: number;
  blogCount: number;
  commentCount: number;
}

const dashboardLoader: LoaderFunction = async () => {
  const accessToken = localStorage.getItem("access-token");

  if (!accessToken) {
    toast.error("Access token is missing!", {
      position: "top-center",
      duration: 5000,
    });

    return redirect("/");
  }

  try {
    const [usersResponse, blogsResponse, commentsResponse] = await Promise.all([
      quillStackApi.get("/users", {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { limit: 5 },
      }),
      quillStackApi.get("/blogs", {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { limit: 5 },
      }),
      quillStackApi.get("/comments", {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { limit: 5 },
      }),
    ]);

    const paginatedUsers = usersResponse.data as PaginatedResponse<
      UserDocument,
      "users"
    >;
    const paginatedBlogs = blogsResponse.data as PaginatedResponse<
      BlogDocument,
      "blogs"
    >;
    const paginatedComments = commentsResponse.data as PaginatedResponse<
      CommentDocument,
      "comments"
    >;

    return {
      users: paginatedUsers.data.users,
      blogs: paginatedBlogs.data.blogs,
      comments: paginatedComments.data.comments,
      userCount: paginatedUsers.data.pagination.total,
      blogCount: paginatedBlogs.data.pagination.total,
      commentCount: paginatedComments.data.pagination.total,
    } as DashboardLoaderResponse;
  } catch (error) {
    if (error instanceof AxiosError) {
      const hasTokenExpired = error.response?.data.message?.includes("expired");

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

export default dashboardLoader;
