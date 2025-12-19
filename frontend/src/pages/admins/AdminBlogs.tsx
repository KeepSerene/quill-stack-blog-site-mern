/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { useEffect, useState } from "react";
import BlogsTable, { columns } from "@/components/BlogsTable";
import type { BlogDocument, PaginatedResponse } from "@/types";
import { useFetcher, useLoaderData } from "react-router";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
} from "lucide-react";

type PaginationAction = "first" | "last" | "previous" | "next" | null;

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 30, 40] as const;

function AdminBlogs() {
  const fetcher = useFetcher();
  const fetcherData = fetcher.data as PaginatedResponse<BlogDocument, "blogs">;
  const loaderData = useLoaderData() as PaginatedResponse<
    BlogDocument,
    "blogs"
  >;

  const isLoading =
    fetcher.state === "loading" &&
    fetcher.formMethod === "GET" &&
    fetcher.formAction === "/admin/blogs";

  const {
    data: {
      blogs,
      pagination: {
        total: totalBlogCount,
        limit: itemsPerPage,
        offset: startIndex,
      },
    },
  } = fetcherData || loaderData;

  // ============================================================
  // PAGINATION CALCULATIONS
  // ============================================================

  // Display range: "Showing X - Y of Z posts"
  const displayRangeStart = startIndex + 1;
  const displayRangeEnd = Math.min(startIndex + itemsPerPage, totalBlogCount);

  // Page numbers: "Page X of Y"
  const totalPages = Math.ceil(totalBlogCount / itemsPerPage);
  const currentPageNumber = Math.floor(startIndex / itemsPerPage) + 1;

  // Navigation states
  const isFirstPage = currentPageNumber === 1;
  const isLastPage = currentPageNumber === totalPages;

  // ============================================================
  // STATE MANAGEMENT
  // ============================================================

  const [selectedItemsPerPage, setSelectedItemsPerPage] =
    useState(itemsPerPage);
  const [selectedStartIndex, setSelectedStartIndex] = useState(startIndex);
  const [lastNavigationAction, setLastNavigationAction] =
    useState<PaginationAction>();

  // ============================================================
  // FETCH DATA WHEN PAGINATION CHANGES
  // ============================================================

  useEffect(() => {
    const searchParams = new URLSearchParams();
    searchParams.set("offset", selectedStartIndex.toString());
    searchParams.set("limit", selectedItemsPerPage.toString());

    // The method is GET, so the route loader will be called
    // with the form data serialized to the url as URLSearchParams
    fetcher.submit(searchParams);
  }, [selectedStartIndex, selectedItemsPerPage]);

  // ============================================================
  // EVENT HANDLERS
  // ============================================================

  const handleItemsPerPageChange = (newItemsPerPage: string) => {
    const newLimit = Number(newItemsPerPage);
    setSelectedItemsPerPage(newLimit);
    setLastNavigationAction(null);

    // If we're on the last page and changing items per page,
    // recalculate the offset to stay on a valid page
    if (isLastPage && startIndex !== 0) {
      const newOffset =
        totalBlogCount - (totalBlogCount % newLimit || newLimit);
      setSelectedStartIndex(newOffset);
    }
  };

  const navigateToFirstPage = () => {
    setSelectedStartIndex(0);
    setLastNavigationAction("first");
  };

  const navigateToPreviousPage = () => {
    setSelectedStartIndex(startIndex - itemsPerPage);
    setLastNavigationAction("previous");
  };

  const navigateToNextPage = () => {
    setSelectedStartIndex(startIndex + itemsPerPage);
    setLastNavigationAction("next");
  };

  const navigateToLastPage = () => {
    const lastPageOffset =
      totalBlogCount - (totalBlogCount % itemsPerPage || itemsPerPage);
    setSelectedStartIndex(lastPageOffset);
    setLastNavigationAction("last");
  };

  return (
    <main className="container p-4 space-y-4">
      <h2 className="text-2xl font-semibold">Articles</h2>

      <BlogsTable columns={columns} data={blogs} />

      <div className="px-4 pb-4 flex justify-between items-center">
        {/* Display range info */}
        <p className="flex-1 text-muted-foreground text-sm font-medium flex">
          Showing {displayRangeStart} - {displayRangeEnd} of {totalBlogCount}{" "}
          posts
        </p>

        <div className="w-fit flex items-center gap-8">
          {/* Items per page selector */}
          <div className="flex items-center gap-2">
            <Label htmlFor="items-per-page" className="text-sm font-medium">
              Rows per page
            </Label>

            <Select
              value={selectedItemsPerPage.toString()}
              onValueChange={handleItemsPerPageChange}
            >
              <SelectTrigger
                type="button"
                id="items-per-page"
                size="sm"
                className="w-20"
              >
                <SelectValue placeholder={itemsPerPage} />
              </SelectTrigger>

              <SelectContent side="top">
                {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Current page info */}
          <p className="w-fit text-sm font-medium flex justify-center items-center">
            Page {currentPageNumber} of {totalPages}
          </p>

          {/* Navigation controls */}
          <div className="flex items-center gap-2">
            {/* First page button */}
            <Button
              type="button"
              variant="outline"
              onClick={navigateToFirstPage}
              disabled={isFirstPage}
              aria-label={
                isLoading && lastNavigationAction === "first"
                  ? "Navigating to first page"
                  : "Go to first page"
              }
              title="First page"
              className="size-8 p-0"
            >
              {isLoading && lastNavigationAction === "first" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ChevronsLeft className="size-4" />
              )}
            </Button>

            {/* Previous page button */}
            <Button
              type="button"
              variant="outline"
              onClick={navigateToPreviousPage}
              disabled={isFirstPage}
              aria-label={
                isLoading && lastNavigationAction === "previous"
                  ? "Navigating to previous page"
                  : "Go to previous page"
              }
              title="Previous page"
              className="size-8 p-0"
            >
              {isLoading && lastNavigationAction === "previous" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ChevronLeft className="size-4" />
              )}
            </Button>

            {/* Next page button */}
            <Button
              type="button"
              variant="outline"
              onClick={navigateToNextPage}
              disabled={isLastPage}
              aria-label={
                isLoading && lastNavigationAction === "next"
                  ? "Navigating to next page"
                  : "Next page"
              }
              title="Go to next page"
              className="size-8 p-0"
            >
              {isLoading && lastNavigationAction === "next" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ChevronRight className="size-4" />
              )}
            </Button>

            {/* Last page button */}
            <Button
              type="button"
              variant="outline"
              onClick={navigateToLastPage}
              disabled={isLastPage}
              aria-label={
                isLoading && lastNavigationAction === "last"
                  ? "Navigating to last page"
                  : "Go to last page"
              }
              title="Last page"
              className="size-8 p-0"
            >
              {isLoading && lastNavigationAction === "last" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ChevronsRight className="size-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AdminBlogs;
