/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { useFetcher } from "react-router";
import { cn } from "@/lib/utils";
import BlogEditor from "@/components/BlogEditor";
import { toast } from "sonner";
import { useEffect } from "react";

function AdminCreateBlog() {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  // handle submission results and show appropriate toasts
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      const response = fetcher.data as any;

      if (response.ok) {
        toast.success("Blog created successfully!", {
          position: "top-center",
        });
      } else if (response.error) {
        toast.error(response.error.message || "Failed to create blog!", {
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
        onSubmit={({ bannerImage, title, content }, status) => {
          const formData = new FormData();

          if (bannerImage) {
            formData.append("banner-image", bannerImage);
          }

          formData.append("title", title);
          formData.append("content", content);
          formData.append("status", status);

          fetcher.submit(formData, {
            method: "post",
            action: "/admin/blogs/create",
            encType: "multipart/form-data",
          });
        }}
      />
    </main>
  );
}

export default AdminCreateBlog;
