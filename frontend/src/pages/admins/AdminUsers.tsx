/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import type { UserDocument, PaginatedResponse } from "@/types";
import { useFetcher, useLoaderData } from "react-router";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import useUser from "@/hooks/useUser";
import UserCard from "@/components/UserCard";

function AdminUsers() {
  const fetcher = useFetcher();
  const fetcherData = fetcher.data as PaginatedResponse<UserDocument, "users">;
  const loaderData = useLoaderData() as PaginatedResponse<
    UserDocument,
    "users"
  >;
  const isLoading =
    fetcher.state === "loading" && fetcher.formAction === "/admin/users";
  const currentUser = useUser();

  const {
    data: {
      users,
      pagination: {
        total: totalUserCount,
        limit: itemsPerPage,
        hasMore: hasMoreUsers,
      },
    },
  } = useMemo(() => fetcherData || loaderData, [fetcherData, loaderData]);

  const [allUsers, setAllUsers] = useState<UserDocument[]>([]);

  // load more users with pagination
  const handleLoadMore = useCallback(() => {
    if (isLoading || !hasMoreUsers) return;

    // next offset based on current accumulated users
    const nextOffset = allUsers.length;

    // using fetcher to load more users without full page navigation
    fetcher.load(`/admin/users?limit=${itemsPerPage}&offset=${nextOffset}`);
  }, [fetcher, isLoading, hasMoreUsers, allUsers.length, itemsPerPage]);

  // Append newly fetched users to the accumulated list
  useEffect(() => {
    setAllUsers((prev) => {
      // avoid duplicates by filtering out users we already have
      const existingIds = new Set(prev.map((c) => c._id));
      const newComments = users.filter((c) => !existingIds.has(c._id));

      return [...prev, ...newComments];
    });
  }, [users]);

  return (
    <main className="container p-4 space-y-4">
      <section className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl font-semibold">Community</h2>

        {/* Display comment count */}
        <p className="text-sm text-muted-foreground">
          Showing {allUsers.length} of {totalUserCount} users
        </p>
      </section>

      {/* Display message if no users exist */}
      {allUsers.length === 0 && !isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No users found!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
          {allUsers.map(
            ({
              _id,
              role,
              username,
              email,
              firstName,
              lastName,
              createdAt,
            }) => (
              <UserCard
                key={_id}
                userId={_id}
                role={role}
                username={username}
                firstName={firstName}
                lastName={lastName}
                email={email}
                createdAt={createdAt}
                currentUser={currentUser}
                onUserDeleteSuccess={() => {
                  setAllUsers((prev) =>
                    prev.filter((user) => user._id !== _id)
                  );
                }}
              />
            )
          )}
        </div>
      )}

      {/* Load more button */}
      {hasMoreUsers && (
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

      {/* Message when all users are loaded */}
      {!hasMoreUsers && allUsers.length > 0 && (
        <p className="text-center text-sm text-muted-foreground pt-4">
          All users loaded
        </p>
      )}
    </main>
  );
}

export default AdminUsers;
