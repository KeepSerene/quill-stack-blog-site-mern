/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { useFetcher } from "react-router";
import { cn } from "@/lib/utils";
import BlogEditor from "@/components/BlogEditor";

function AdminCreateBlog() {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  return (
    <main
      className={cn(
        "max-w-3xl w-full mx-auto p-4",
        isSubmitting && "opacity-50 pointer-events-none"
      )}
    >
      <BlogEditor onSubmit={() => {}} />
    </main>
  );
}

export default AdminCreateBlog;
