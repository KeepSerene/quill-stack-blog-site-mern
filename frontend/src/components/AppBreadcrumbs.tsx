/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { Fragment, useMemo } from "react";
import { Link, useLocation, useMatches, type UIMatch } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

/**
 * Type definition for route metadata containing breadcrumb information.
 * This is attached to routes via the `handle` property.
 */
type BreadcrumbHandle = {
  /**
   * Breadcrumb label - can be:
   * - A static string: "Dashboard"
   * - A function that returns dynamic text: (args) => `Edit ${args.params.slug}`
   */
  breadcrumb?:
    | string
    | ((args: {
        params: Record<string, string | undefined>;
        data: unknown;
      }) => string);
};

type BreadcrumbItem = {
  label: string;
  href: string;
};

function AppBreadcrumbs() {
  const location = useLocation();

  // Get ALL matched routes for the current URL path
  // Example: /admin/blogs/create returns ["/admin", "/admin/blogs", "/admin/blogs/create"]
  const matches = useMatches() as UIMatch<unknown, BreadcrumbHandle>[];

  /**
   * Build the breadcrumb trail:
   * 1. Filter: Keep only routes that have breadcrumb metadata
   * 2. Map: Transform each route into a breadcrumb item with label and href
   */
  const crumbs = useMemo<BreadcrumbItem[]>(
    () =>
      matches
        .filter((match) => match.handle?.breadcrumb)
        .map((match) => {
          const { handle, params } = match;
          // note: 'data' is available but deprecated in React Router v7
          // for now, we keep it for backward compatibility with dynamic breadcrumbs
          const { data } = match;

          // compute the label: call function if dynamic, use string if static
          const label =
            typeof handle.breadcrumb === "function"
              ? handle.breadcrumb({ params, data })
              : handle.breadcrumb!;

          return {
            label,
            href: match.pathname,
          };
        }),
    [matches]
  );

  if (crumbs.length === 0) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map(({ label, href }, index) => {
          const isCurrentPage = href === location.pathname;
          const isLastItem = index === crumbs.length - 1;

          return (
            <Fragment key={href}>
              <BreadcrumbItem className="max-md:hidden">
                {isCurrentPage ? (
                  // current page: not clickable
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  // previous pages: clickable links
                  <BreadcrumbLink asChild>
                    <Link to={href} viewTransition>
                      {label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {!isLastItem && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default AppBreadcrumbs;
