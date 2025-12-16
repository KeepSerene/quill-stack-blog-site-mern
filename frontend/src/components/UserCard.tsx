/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type { UserProfile } from "@/hooks/useUser";
import { Card, CardContent } from "@/components/ui/card";
import { useFetcher } from "react-router";
import Avatar from "react-avatar";
import { getUserName } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDistanceToNowStrict } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface UserCardProps {
  userId: string;
  role: "admin" | "user";
  username: string;
  firstName?: string;
  lastName?: string;
  email: string;
  createdAt: string;
  currentUser?: UserProfile; // currently logged-in user
  onUserDeleteSuccess?: () => void;
}

function UserCard({
  userId,
  role,
  username,
  firstName,
  lastName,
  email,
  createdAt,
  currentUser,
  onUserDeleteSuccess,
}: UserCardProps) {
  const fetcher = useFetcher();
  const isCurrentUser = currentUser?.username === username;

  return (
    <Card className="py-4 group">
      <CardContent className="px-4 grid grid-cols-[max-content_minmax(0,1fr)_max-content] gap-3 sm:gap-4">
        <Avatar
          size="40"
          email={email}
          name={getUserName({ firstName, lastName, username })}
          className="rounded-lg shrink-0"
        />

        {/* User info section */}
        <section className="min-w-0 flex flex-col justify-center">
          {/* Name and badges row */}
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold truncate">
              {getUserName({ firstName, lastName, username })}
            </h3>

            {/* Admin badge */}
            {role === "admin" && (
              <Badge variant="outline" className="capitalize shrink-0">
                {role}
              </Badge>
            )}

            {/* You badge */}
            {isCurrentUser && (
              <Badge variant="secondary" className="shrink-0">
                You
              </Badge>
            )}
          </div>

          {/* Email */}
          <p
            title={email}
            className="text-muted-foreground text-sm truncate mt-1"
          >
            {email}
          </p>

          {/* Join date with tooltip */}
          <div className="text-muted-foreground text-xs mt-2">
            <Tooltip>
              <TooltipTrigger type="button" className="text-left">
                Joined{" "}
                {formatDistanceToNowStrict(createdAt, { addSuffix: true })}
              </TooltipTrigger>

              <TooltipContent side="right">
                {new Date(createdAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </TooltipContent>
            </Tooltip>
          </div>
        </section>

        {/* Delete button alert dialog */}
        {!isCurrentUser && (
          <AlertDialog>
            <AlertDialogTrigger type="button" asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Delete user"
                title="Delete"
                className="shrink-0 self-start xl:opacity-0 xl:group-hover:opacity-100 xl:group-focus-within:opacity-100 transition-opacity"
              >
                <Trash2 className="size-4" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete User: {email}?</AlertDialogTitle>

                <AlertDialogDescription>
                  Are you sure? This will permanently delete all user-related
                  data.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel type="button">Cancel</AlertDialogCancel>

                {/* Delete button */}
                <AlertDialogAction
                  type="button"
                  onClick={() => {
                    const submitPromise = fetcher.submit(
                      { userId },
                      {
                        method: "delete",
                        action: "/admin/users",
                        encType: "application/json",
                      }
                    );
                    toast.promise(submitPromise, {
                      loading: "Deleting user account...",
                      success() {
                        if (onUserDeleteSuccess) onUserDeleteSuccess();

                        return "User account deleted successfully!";
                      },
                      error(err) {
                        return `Error deleting user account: ${err.message}`;
                      },
                    });
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardContent>
    </Card>
  );
}

export default UserCard;
