/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { cn } from "@/lib/utils";
import type React from "react";
import { Link, useLocation, useNavigation } from "react-router";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import AppBreadcrumbs from "@/components/AppBreadcrumbs";
import { Button } from "@/components/ui/button";
import { PencilLine } from "lucide-react";
import ThemeToggler from "@/components/ThemeToggler";
import CustomTopProgressBar from "@/components/CustomTopProgressBar";

function AppTopBar({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"header">) {
  const location = useLocation();
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <header
      {...props}
      className={cn(
        "shrink-0 h-16 px-4 flex items-center gap-2 relative",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <SidebarTrigger
          type="button"
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
        />

        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-4"
        />

        <AppBreadcrumbs />
      </div>

      <div className="ml-auto flex items-center gap-2">
        {location.pathname === "/admin/blogs/create" && (
          <Button type="button" asChild>
            <Link
              to="/admin/blogs/create"
              aria-label="Write a blog"
              viewTransition
            >
              <PencilLine className="size-4" />
              <span>Start Quilling</span>
            </Link>
          </Button>
        )}

        <ThemeToggler />
      </div>

      {isLoading && <CustomTopProgressBar />}
    </header>
  );
}

export default AppTopBar;
