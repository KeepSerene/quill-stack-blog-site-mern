/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { motion, type Variants } from "motion/react";
import { Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { BlogDocument, UserDocument } from "@/types";
import { Link, useFetcher } from "react-router";
import Avatar from "react-avatar";
import { cn, getUserName } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNowStrict } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Loader2, MoreHorizontal } from "lucide-react";
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

const MotionTableBody = motion.create(TableBody);
const MotionTableRow = motion.create(TableRow);

const tableBodyVariant: Variants = {
  to: { transition: { delayChildren: 0.01 } },
};

const tableRowVariant: Variants = {
  from: { opacity: 0 },
  to: { opacity: 1, transition: { duration: 0.5 } },
};

function BlogActionsDropdown({ blog }: { blog: BlogDocument }) {
  const fetcher = useFetcher();
  const isLoading = fetcher.state !== "idle";
  const isUpdating = isLoading && fetcher.formMethod === "PUT";
  const isDeleting = isLoading && fetcher.formMethod === "DELETE";

  const isPublished = useMemo(() => blog.status === "published", [blog.status]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="size-8 data-[state=open]:bg-muted text-muted-foreground flex"
        >
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Open more actions menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link to={`/admin/blogs/${blog.slug}/edit`} viewTransition>
            Edit
          </Link>
        </DropdownMenuItem>

        {/* Publish/unpublish action */}
        <AlertDialog>
          <AlertDialogTrigger type="button" asChild>
            <DropdownMenuItem
              onSelect={(event) => event.preventDefault()}
              disabled={isUpdating}
              className="cursor-pointer"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Updating</span>
                </>
              ) : isPublished ? (
                "Unpublish"
              ) : (
                "Publish"
              )}
            </DropdownMenuItem>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {isPublished ? "Unpublish Post" : "Publish Post"}
              </AlertDialogTitle>

              <AlertDialogDescription>
                {isPublished
                  ? "This will hide your post from readers. You can republish anytime."
                  : "This will make your post visible to everyone. You can unpublish later if needed."}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel type="button">Cancel</AlertDialogCancel>

              <AlertDialogAction
                type="button"
                onClick={() => {
                  const formData = new FormData();
                  formData.append(
                    "status",
                    isPublished ? "draft" : "published"
                  );
                  fetcher.submit(formData, {
                    method: "put",
                    action: `/admin/blogs/${blog.slug}/edit`,
                    encType: "multipart/form-data",
                  });
                }}
              >
                {isPublished ? "Unpublish" : "Publish"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <DropdownMenuSeparator />

        {/* Delete action */}
        <AlertDialog>
          <AlertDialogTrigger type="button" asChild>
            <DropdownMenuItem
              variant="destructive"
              onSelect={(event) => event.preventDefault()}
              disabled={isDeleting}
              className="cursor-pointer"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Deleting</span>
                </>
              ) : (
                "Delete"
              )}
            </DropdownMenuItem>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Post?</AlertDialogTitle>

              <AlertDialogDescription>
                This action cannot be undone. Are you sure you want to delete
                this post permanently?
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel type="button">Cancel</AlertDialogCancel>

              <AlertDialogAction
                type="button"
                onClick={() => {
                  const data = { blogId: blog._id };
                  fetcher.submit(data, {
                    method: "delete",
                    action: "/admin/blogs",
                    encType: "application/json",
                  });
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const columns: ColumnDef<BlogDocument>[] = [
  {
    accessorKey: "title",
    header: "Blog",
    cell: ({ row }) => {
      const blog = row.original;
      const editor = new Editor({
        extensions: [StarterKit],
        content: blog.content,
        editable: false,
        autofocus: false,
      });

      return (
        <Link
          to={`/blogs/${blog.slug}`}
          className="flex items-center gap-4 group"
          viewTransition
        >
          <figure className="shrink-0 w-[120px] h-[68px] rounded-md overflow-hidden">
            <img
              src={blog.banner.url}
              width={blog.banner.width}
              height={blog.banner.height}
              alt={blog.title}
              className="size-full object-cover"
            />
          </figure>

          <span className="grid grid-cols-1 gap-1">
            <span className="max-w-[50ch] font-semibold truncate group-hover:underline group-focus-visible:underline">
              {blog.title}
            </span>

            <span className="max-w-[50ch] text-muted-foreground text-wrap line-clamp-2">
              {`${editor.getText().slice(0, 400)}...`}
            </span>
          </span>
        </Link>
      );
    },
  },
  {
    accessorKey: "author",
    header: "Author",
    cell: ({ row }) => {
      const author = row.getValue("author") as UserDocument;

      return (
        <div className="flex items-center gap-2">
          <Avatar
            email={author.email}
            name={getUserName(author)}
            size="24"
            className="rounded-md"
          />

          <p>{getUserName(author)}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as "draft" | "published";

      return (
        <Badge
          variant="outline"
          className={cn(
            "capitalize gap-1.5",
            status === "published"
              ? "bg-emerald-100/20 dark:bg-emerald-800/20 border-emerald-300 dark:border-emerald-800"
              : "bg-amber-100/20 dark:bg-amber-800/20 border-amber-300 dark:border-amber-800"
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              status === "published"
                ? "bg-emerald-500 dark:bg-emerald-600"
                : "bg-amber-500 dark:bg-amber-600"
            )}
          />

          <span
            className={cn(
              status === "published"
                ? "text-emerald-800 dark:text-emerald-500"
                : "text-amber-800 dark:text-amber-500"
            )}
          >
            {status}
          </span>
        </Badge>
      );
    },
  },
  {
    accessorKey: "editedAt",
    header: "Modified",
    cell: ({ row }) => {
      const editedAt = row.getValue("editedAt") as string;
      const date = formatDistanceToNowStrict(editedAt, { addSuffix: true });

      return (
        <Tooltip>
          <TooltipTrigger type="button">{date}</TooltipTrigger>

          <TooltipContent>
            {new Date(editedAt).toLocaleString("en-IN", {
              timeStyle: "short",
              dateStyle: "long",
            })}
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    id: "actions",
    enableHiding: true,
    cell: ({ row }) => <BlogActionsDropdown blog={row.original} />,
  },
];

interface BlogsTableProps {
  data: BlogDocument[];
  columns: ColumnDef<BlogDocument>[];
}

const BlogsTable = ({ data, columns }: BlogsTableProps) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="border-none">
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                colSpan={header.colSpan}
                className="bg-muted px-4 first:rounded-l-lg last:rounded-r-lg"
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>

      <MotionTableBody initial="from" animate="to" variants={tableBodyVariant}>
        {table.getRowModel().rows.length > 0 ? (
          table.getRowModel().rows.map((row) => (
            <MotionTableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
              variants={tableRowVariant}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className="max-w-max min-h-16 px-4 py-3"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </MotionTableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              Looks like there are no blogs here. Why not add one?
            </TableCell>
          </TableRow>
        )}
      </MotionTableBody>
    </Table>
  );
};

export default BlogsTable;
