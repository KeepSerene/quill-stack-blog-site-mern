/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { getUserName } from "@/lib/utils";
import type { BlogDocument, UserDocument } from "@/types";
import Avatar from "react-avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { ExternalLink, ThumbsUp, Trash2 } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Link } from "react-router";

interface CommentCardProps {
  user: UserDocument | null; // can be null if user was deleted
  blog: BlogDocument | null; // can be null if blog was deleted
  content: string;
  likeCount: number;
  createdAt: string;
}

const CommentCard = ({
  user,
  blog,
  content,
  likeCount,
  createdAt,
}: CommentCardProps) => (
  <div className="@container">
    <div
      tabIndex={0}
      className="rounded-xl p-4 flex flex-col @md:flex-row items-start gap-4 group hover:bg-accent/25 focus-within:bg-accent/25"
    >
      {/* User avatar and info section */}
      <Avatar email={user?.email} name={getUserName(user)} size="40" round />

      <div className="mr-auto flex flex-col gap-2">
        {/* User and created at */}
        <div className="flex items-center gap-2">
          {/* Username */}
          {user ? (
            <p className="text-muted-foreground text-sm">@{user.username}</p>
          ) : (
            // Deleted account indicator with tooltip
            <div className="text-destructive/80 text-sm italic">
              <Tooltip delayDuration={250}>
                <TooltipTrigger>{getUserName(user)}</TooltipTrigger>
                <TooltipContent>This account has been removed!</TooltipContent>
              </Tooltip>
            </div>
          )}

          {/* Separator */}
          <div className="size-1 bg-muted-foreground/50 rounded-full" />

          {/* Created at timestamp */}
          <div className="text-muted-foreground text-sm">
            <Tooltip delayDuration={250}>
              <TooltipTrigger>
                {formatDistanceToNow(createdAt, { addSuffix: true })}
              </TooltipTrigger>

              <TooltipContent>
                {new Date(createdAt).toLocaleString("en-IN", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Comment content */}
        <p className="max-w-[60ch]">{content}</p>

        {/* Like and delete buttons */}
        <div className="mt-1 flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            aria-label="Like the comment"
            title="Like"
          >
            <ThumbsUp className="size-4" />
            {likeCount > 0 && (
              <span className="sr-only">Total likes: {likeCount}</span>
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            aria-label="Delete the comment"
            title="Delete"
          >
            <Trash2 />
          </Button>
        </div>
      </div>

      {/* Associated blog preview section */}
      {blog && (
        <>
          <div className="@max-3xl:hidden max-w-80 grid grid-cols-[120px_minmax(200px,1fr)] gap-3">
            <AspectRatio ratio={21 / 9} className="rounded-lg overflow-hidden">
              <img
                src={blog.banner.url}
                width={blog.banner.width}
                height={blog.banner.height}
                alt={blog.title}
                className="size-full object-cover"
              />
            </AspectRatio>

            <p className="max-w-[30ch] text-muted-foreground text-sm line-clamp-3 my-1">
              {blog.title.slice(0, 400)}
            </p>
          </div>

          {/* Link to blog post */}
          <Button
            type="button"
            variant="ghost"
            className="@3xl:invisible @xl:group-hover:visible @xl:group-focus-within:visible"
            asChild
          >
            <Link
              to={`/blogs/${blog.slug}`}
              aria-label="Visit article"
              title="Visit article"
              viewTransition
            >
              <span className="@md:hidden">Visit article</span>
              <ExternalLink className="size-4" />
            </Link>
          </Button>
        </>
      )}
    </div>
  </div>
);

export default CommentCard;
