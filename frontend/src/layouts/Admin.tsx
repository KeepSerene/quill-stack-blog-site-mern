/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import AppTopBar from "@/components/AppTopBar";
import { Outlet } from "react-router";

function AdminLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="max-h-[calc(100dvh-16px)] overflow-auto relative">
        <AppTopBar />

        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}

export default AdminLayout;
