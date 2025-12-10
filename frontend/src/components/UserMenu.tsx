/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Avatar from "react-avatar";
import type { UserProfile } from "@/hooks/useUser";
import { LayoutDashboard, LogOut, Settings2 } from "lucide-react";
import { Link } from "react-router";
import SettingsDialog from "@/components/SettingsDialog";
import useLogOut from "@/hooks/useLogOut";

function UserMenu({ user }: { user: UserProfile }) {
  const logOut = useLogOut();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" size="icon">
          <Avatar
            size="28"
            email={user.email}
            name={user.username}
            className="rounded-sm"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-56">
        <>
          <DropdownMenuLabel className="font-normal p-0">
            <div className="text-left text-sm px-1 py-1.5 flex items-center gap-2">
              <Avatar
                size="32"
                email={user.email}
                name={user.username}
                className="rounded-lg"
              />

              <div className="flex-1 leading-tight grid grid-cols-1">
                <p className="font-medium truncate">{user.username}</p>
                <p className="text-xs truncate">{user.email}</p>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />
        </>

        <DropdownMenuGroup>
          {user.role === "admin" && (
            <DropdownMenuItem asChild>
              <Link
                to="/admin/dashboard"
                viewTransition
                className="cursor-pointer"
              >
                <LayoutDashboard className="size-4" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
          )}

          <SettingsDialog>
            <DropdownMenuItem
              onSelect={(event) => event.preventDefault()}
              className="cursor-pointer"
            >
              <Settings2 className="size-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </SettingsDialog>

          <DropdownMenuItem
            onClick={logOut}
            aria-label="Click to log out"
            className="cursor-pointer"
          >
            <LogOut className="size-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserMenu;
