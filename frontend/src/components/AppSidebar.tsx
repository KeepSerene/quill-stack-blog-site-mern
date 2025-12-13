/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type React from "react";
import {
  LayoutDashboard,
  MessageSquareHeart,
  Text,
  Users2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router";
import Logo from "@/components/Logo";
import SidebarUserMenu from "@/components/SidebarUserMenu";

const MAIN_MENU_ITEMS = [
  {
    label: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Blogs",
    url: "/admin/blogs",
    icon: Text,
  },
  {
    label: "Users",
    url: "/admin/users",
    icon: Users2,
  },
  {
    label: "Comments",
    url: "/admin/comments",
    icon: MessageSquareHeart,
  },
] as const;

function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton type="button" size="lg">
              <Logo />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>

          <SidebarMenu>
            {MAIN_MENU_ITEMS.map(({ label, url, icon: Icon }) => (
              <SidebarMenuItem key={label}>
                <SidebarMenuButton
                  type="button"
                  isActive={location.pathname === url}
                  tooltip={label}
                  asChild
                >
                  <Link to={url} viewTransition>
                    <Icon className="size-4" />
                    <span>{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarUserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
