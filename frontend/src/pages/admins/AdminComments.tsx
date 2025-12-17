/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import type {
  BlogDocument,
  CommentDocument,
  PaginatedResponse,
  UserDocument,
} from "@/types";
import { useFetcher, useLoaderData } from "react-router";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import CommentCard from "@/components/CommentCard";
import { Separator } from "@/components/ui/separator";

function AdminComments() {
  const fetcher = useFetcher();
  const fetcherData = fetcher.data as PaginatedResponse<
    CommentDocument,
    "comments"
  >;
  const loaderData = useLoaderData() as PaginatedResponse<
    CommentDocument,
    "comments"
  >;
  const isLoading =
    fetcher.state === "loading" && fetcher.formAction === "/admin/comments";

  const {
    data: {
      comments,
      pagination: {
        total: totalCommentCount,
        limit: itemsPerPage,
        hasMore: hasMoreComments,
      },
    },
  } = useMemo(() => fetcherData || loaderData, [fetcherData, loaderData]);

  const [allComments, setAllComments] = useState<CommentDocument[]>([]);

  // load more comments with pagination
  const handleLoadMore = useCallback(() => {
    if (isLoading || !hasMoreComments) return;

    // next offset based on current accumulated comments
    const nextOffset = allComments.length;

    // using fetcher to load more comments without full page navigation
    fetcher.load(`/admin/comments?limit=${itemsPerPage}&offset=${nextOffset}`);
  }, [fetcher, isLoading, hasMoreComments, allComments.length, itemsPerPage]);

  // Append newly fetched comments to the accumulated list
  useEffect(() => {
    setAllComments((prev) => {
      // avoid duplicates by filtering out comments we already have
      const existingIds = new Set(prev.map((c) => c._id));
      const newComments = comments.filter((c) => !existingIds.has(c._id));

      return [...prev, ...newComments];
    });
  }, [comments]);

  return (
    <main className="container p-4 space-y-4">
      <section className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl font-semibold">Discussions</h2>

        {/* Display comment count */}
        <p className="text-sm text-muted-foreground">
          Showing {allComments.length} of {totalCommentCount} comments
        </p>
      </section>

      {/* Display message if no comments exist */}
      {allComments.length === 0 && !isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No comments found!</p>
        </div>
      ) : (
        <div className="space-y-0">
          {allComments.map(
            (
              { _id, blog, user, content, likeCount, createdAt },
              index,
              array
            ) => (
              <Fragment key={_id}>
                <CommentCard
                  blog={blog as BlogDocument}
                  user={user as UserDocument}
                  content={content}
                  likeCount={likeCount}
                  createdAt={createdAt}
                />

                {index < array.length - 1 && <Separator />}
              </Fragment>
            )
          )}
        </div>
      )}

      {/* Load more button */}
      {hasMoreComments && (
        <div className="flex justify-center pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleLoadMore}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}

      {/* Message when all comments are loaded */}
      {!hasMoreComments && allComments.length > 0 && (
        <p className="text-center text-sm text-muted-foreground pt-4">
          All comments loaded
        </p>
      )}
    </main>
  );
}

export default AdminComments;
