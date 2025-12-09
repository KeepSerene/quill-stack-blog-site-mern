/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type React from "react";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router";

const NAV_LINKS = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/blogs",
    label: "Blogs",
  },
  {
    href: "/about",
    label: "About",
  },
  {
    href: "/contact",
    label: "Contact",
  },
] as const;

function Navbar({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"nav">) {
  return (
    <nav {...props} aria-label="Primary navigation" className={className}>
      <ul className="flex flex-col gap-x-1 gap-y-2 md:flex-row md:items-center">
        {NAV_LINKS.map(({ href, label }) => (
          <li key={label}>
            <Button
              type="button"
              variant="ghost"
              className="max-md:w-full max-md:justify-start"
              asChild
            >
              <NavLink to={href} viewTransition className="nav-link">
                {label}
              </NavLink>
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
