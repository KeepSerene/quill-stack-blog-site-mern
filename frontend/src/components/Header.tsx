/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type React from "react";
import { useState } from "react";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";
import Navbar from "@/components/Navbar";
import useUser from "@/hooks/useUser";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import ThemeToggler from "@/components/ThemeToggler";
import UserMenu from "@/components/UserMenu";
import { Menu, X } from "lucide-react";

function Header({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"header">) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const user = useUser();

  return (
    <header
      {...props}
      className={cn(
        "w-full h-16 bg-background border-b flex justify-center items-center fixed left-0 top-0 z-40",
        className
      )}
    >
      <div className="container py-3 flex items-center gap-4">
        {/* Logo */}
        <Logo />

        <div
          className={cn(
            "grow max-md:w-full max-md:border-b max-md:bg-background max-md:absolute max-md:left-0 max-md:top-16 md:flex md:justify-between md:items-center",
            !isMobileMenuOpen && "max-md:hidden"
          )}
        >
          {/* Navbar */}
          <Navbar className="max-md:p-3 max-md:ml-4" />

          {/* Auth action buttons */}
          {!user && (
            <>
              <Separator className="md:hidden" />

              <div className="max-md:p-3 flex flex-col-reverse gap-x-2 gap-y-3 md:flex-row md:items-center">
                <Button type="button" variant="outline" asChild>
                  <Link to="/login" viewTransition>
                    Sign in
                  </Link>
                </Button>

                <Button type="button" asChild>
                  <Link to="/register" viewTransition>
                    Get Started
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Theme toggler + User menu */}
        <div className="ml-auto flex items-center gap-1">
          <ThemeToggler />

          {user && <UserMenu user={user} />}

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            className="md:hidden"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Header;
