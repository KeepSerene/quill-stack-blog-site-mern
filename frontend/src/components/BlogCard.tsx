/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { cn } from "@/lib/utils";
import { Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDistanceToNowStrict } from "date-fns";
import { Link } from "react-router";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface BlogCardProps extends React.ComponentPropsWithoutRef<"div"> {
  bannerUrl: string;
  bannerWidth: number;
  bannerHeight: number;
  title: string;
  content: string;
  slug: string;
  authorName: string;
  publishedAt: string;
  size?: "default" | "sm";
}

function BlogCard({
  bannerUrl,
  bannerWidth,
  bannerHeight,
  title,
  content,
  slug,
  authorName,
  publishedAt,
  size = "default",
  className,
  ...props
}: BlogCardProps) {
  const editor = new Editor({
    extensions: [StarterKit],
    content,
    editable: false,
    autofocus: false,
  });

  return (
    <Card
      {...props}
      className={cn(
        "h-full pt-2 relative @container group",
        size === "default" && "flex flex-col-reverse justify-end",
        size === "sm" && "py-2 grid grid-cols-[1fr_1.15fr] items-center gap-0",
        className
      )}
    >
      <CardHeader
        className={cn(
          "gap-2",
          size === "sm" && "content-center order-1 pl-4 py-3"
        )}
      >
        <div className="text-muted-foreground text-sm font-medium flex items-center gap-2">
          <p className="@max-xs:hidden">{authorName}</p>

          <div className="size-1 bg-muted-foreground/50 rounded-full @max-3xs:hidden"></div>

          <Tooltip delayDuration={250}>
            <TooltipTrigger>
              {formatDistanceToNowStrict(publishedAt, { addSuffix: true })}
            </TooltipTrigger>

            <TooltipContent>
              {new Date(publishedAt).toLocaleString("en-IN", {
                timeStyle: "short",
                dateStyle: "long",
              })}
            </TooltipContent>
          </Tooltip>
        </div>

        <Link
          to={`/blogs/${slug}`}
          viewTransition
          className="hover:underline focus-visible:underline"
        >
          <CardTitle
            className={cn(
              "leading-tight line-clamp-2 underline-offset-4",
              size === "default" && "text-xl @md:text-2xl"
            )}
          >
            {title}
          </CardTitle>
        </Link>

        <CardDescription
          className={cn(
            "text-balance line-clamp-2",
            size === "sm" && "@max-2xs:hidden"
          )}
        >
          {editor.getText()}
        </CardDescription>
      </CardHeader>

      <CardContent className="px-2">
        <Link to={`/blogs/${slug}`} viewTransition>
          <AspectRatio ratio={21 / 9} className="rounded-lg overflow-hidden">
            <img
              src={bannerUrl}
              width={bannerWidth}
              height={bannerHeight}
              alt={title}
              className="size-full object-cover"
            />
          </AspectRatio>
        </Link>
      </CardContent>
    </Card>
  );
}

export default BlogCard;
