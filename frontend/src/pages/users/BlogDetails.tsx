/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import Page from "@/components/Page";
import { useLoaderData, useNavigate } from "react-router";
import type { blogDetailsResponse } from "@/routes/loaders/users/blogDetailsLoader";
import { Editor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Link2,
  MessageSquareHeart,
  Share2,
  ThumbsUp,
  View,
} from "lucide-react";
import Avatar from "react-avatar";
import { getReadingTime, getUserName } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import type { DropdownMenuProps } from "@radix-ui/react-dropdown-menu";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ShareButtonDropdownProps extends DropdownMenuProps {
  blogTitle: string;
}

function ShareButtonDropdown({
  blogTitle,
  children,
  ...props
}: ShareButtonDropdownProps) {
  const blogUrl = window.location.href;
  const shareText = `Just read "${blogTitle}" — thought you might enjoy it!`;

  const shareUrls = useMemo(
    () => ({
      linkedIn: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
        blogUrl
      )}&title=${encodeURIComponent(blogTitle)}&summary=${encodeURIComponent(
        shareText
      )}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        blogUrl
      )}&quote=${encodeURIComponent(shareText)}`,
      x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
      )}&url=${encodeURIComponent(blogUrl)}`,
    }),
    [blogTitle, blogUrl, shareText]
  );

  const handleCopy = useCallback(async () => {
    try {
      await navigator?.clipboard?.writeText(blogUrl);
      toast.success("Blog URL copied!");
    } catch (error) {
      console.error("Error copying blog URL:", error);
      toast.error("Failed to copy blog URL!", {
        position: "top-center",
        duration: 5000,
      });
    }
  }, [blogUrl]);

  const share = useCallback((shareUrl: string) => {
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  }, []);

  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-60">
        <DropdownMenuItem onSelect={handleCopy} className="cursor-pointer">
          <Link2 />
          <span>Copy Blog URL</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() => share(shareUrls.linkedIn)}
          className="cursor-pointer"
        >
          <img
            src="/social-icons/linkedin.svg"
            alt="LinkedIn icon"
            className="size-4 brightness-0 dark:invert"
          />
          <span>Share on LinkedIn</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={() => share(shareUrls.facebook)}
          className="cursor-pointer"
        >
          <img
            src="/social-icons/facebook.svg"
            alt="Facebook icon"
            className="size-4 brightness-0 dark:invert"
          />
          <span>Share on Facebook</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={() => share(shareUrls.x)}
          className="cursor-pointer"
        >
          <img
            src="/social-icons/x.svg"
            alt="X icon"
            className="size-4 brightness-0 dark:invert"
          />
          <span>Share on X</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function BlogDetails() {
  const { blog } = useLoaderData() as blogDetailsResponse;

  const navigate = useNavigate();

  const editor = new Editor({
    extensions: [StarterKit],
    content: blog.content,
    editable: false,
    autofocus: false,
  });

  return (
    <Page>
      <article className="container max-w-[720px] pt-6 pb-12 relative">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="-ml-16 sticky top-22"
        >
          <ArrowLeft />
        </Button>

        <h1 className="text-4xl font-semibold leading-tight -mt-10">
          {blog.title}
        </h1>

        <div className="my-8 flex items-center gap-3">
          <div className="flex items-center gap-3">
            <Avatar
              email={blog.author.email}
              name={getUserName(blog.author)}
              size="32"
              round
            />

            <span>{getUserName(blog.author)}</span>
          </div>

          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:size-1 rounded-full"
          />

          <p className="text-muted-foreground">
            {getReadingTime(editor.getText() || "").minutes} min read
          </p>

          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:size-1 rounded-full"
          />

          <p className="text-muted-foreground">
            {new Date(blog.publishedAt).toLocaleDateString("en-IN", {
              dateStyle: "medium",
            })}
          </p>
        </div>

        <Separator />

        <div className="my-2 flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            aria-label="Like the blog post"
            title="Likes"
          >
            <ThumbsUp className="size-4" />
            <span>{blog.likeCount}</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            aria-label="Comment on the blog post"
            title="Comments"
          >
            <MessageSquareHeart className="size-4" />
            <span>{blog.commentCount}</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            aria-label="Views on the blog post"
            title="Views"
          >
            <View className="size-4" />
            <span>{blog.viewCount}</span>
          </Button>

          <ShareButtonDropdown blogTitle={blog.title}>
            <Button type="button" variant="ghost" className="ml-auto">
              <Share2 className="size-4" />
              <span>Share</span>
            </Button>
          </ShareButtonDropdown>
        </div>

        <Separator />

        <div className="my-8">
          <AspectRatio
            ratio={21 / 9}
            className="bg-border rounded-xl overflow-hidden"
          >
            <img
              src={blog.banner.url}
              width={blog.banner.width}
              height={blog.banner.height}
              alt={`Banner of "${blog.title}"`}
              className="size-full object-cover"
            />
          </AspectRatio>
        </div>

        <EditorContent editor={editor} />
      </article>
    </Page>
  );
}

export default BlogDetails;
