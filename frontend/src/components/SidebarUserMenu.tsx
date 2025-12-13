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
import Avatar from "react-avatar";
import { ChevronsUpDown, LogOut, Settings2 } from "lucide-react";
import SettingsDialog from "@/components/SettingsDialog";
import useLogOut from "@/hooks/useLogOut";
import useUser from "@/hooks/useUser";
import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

function SidebarUserMenu() {
  const { isMobile } = useSidebar();
  const user = useUser();
  const logOut = useLogOut();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              type="button"
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar
                email={user?.email}
                name={user?.username}
                size="32"
                className="rounded-lg"
              />

              <span className="flex-1 text-sm text-left leading-tight grid grid-cols-1">
                <span className="font-medium truncate">{user?.username}</span>
                <span className="text-xs truncate">{user?.email}</span>
              </span>

              <ChevronsUpDown className="size-4 ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
            align="end"
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          >
            <>
              <DropdownMenuLabel className="font-normal p-0">
                <div className="text-left text-sm px-1 py-1.5 flex items-center gap-2">
                  <Avatar
                    size="32"
                    email={user?.email}
                    name={user?.username}
                    className="rounded-lg"
                  />

                  <div className="flex-1 leading-tight grid grid-cols-1">
                    <p className="font-medium truncate">{user?.username}</p>
                    <p className="text-xs truncate">{user?.email}</p>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />
            </>

            <DropdownMenuGroup>
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
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export default SidebarUserMenu;
