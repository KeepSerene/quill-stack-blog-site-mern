/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { useFetcher, useLoaderData } from "react-router";
import type { blogDetailsResponse } from "@/routes/loaders/users/blogDetailsLoader";
import BlogEditor from "@/components/BlogEditor";
import { toast } from "sonner";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

function AdminEditBlog() {
  const { blog } = useLoaderData() as blogDetailsResponse;
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  // handle submission results
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      const response = fetcher.data as any;

      if (response.ok) {
        toast.success("Blog updated successfully!", {
          position: "top-center",
        });
      } else if (response.error) {
        toast.error(response.error.message || "Failed to update blog", {
          position: "top-center",
        });
      }
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <main
      className={cn(
        "max-w-3xl w-full mx-auto p-4",
        isSubmitting && "opacity-50 pointer-events-none"
      )}
    >
      <BlogEditor
        defaultValues={{
          bannerUrl: blog.banner.url,
          title: blog.title,
          content: blog.content,
          status: blog.status,
        }}
        onSubmit={({ bannerImage, title, content }, status) => {
          const formData = new FormData();

          // only append changed fields to optimize request size
          if (bannerImage) formData.append("banner-image", bannerImage);
          if (blog.title !== title) formData.append("title", title);
          if (blog.content !== content) formData.append("content", content);
          if (blog.status !== status) formData.append("status", status);

          // check if any changes were made before submitting
          if (
            !formData.has("banner-image") &&
            !formData.has("title") &&
            !formData.has("content") &&
            !formData.has("status")
          ) {
            toast.info("No changes to save", {
              position: "top-center",
            });
            return;
          }

          fetcher.submit(formData, {
            method: "put",
            encType: "multipart/form-data",
          });
        }}
      />
    </main>
  );
}

export default AdminEditBlog;
