/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useUser from "@/hooks/useUser";
import type { DashboardLoaderResponse } from "@/routes/loaders/admins/dashboardLoader";
import { MessageSquareHeart, Text, Users2 } from "lucide-react";
import { Link, useLoaderData } from "react-router";
import BlogsTable, { columns } from "@/components/BlogsTable";

function Dashboard() {
  const { users, userCount, blogs, blogCount, comments, commentCount } =
    useLoaderData() as DashboardLoaderResponse;
  const currentUser = useUser();

  return (
    <main className="container p-4 space-y-4">
      <h2 className="text-2xl font-semibold">Dashboard</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* User count */}
        <Card className="py-4 gap-4">
          <CardHeader className="px-4 flex items-center gap-2.5">
            <div className="max-w-max bg-muted text-muted-foreground rounded-lg p-2">
              <Users2 size={18} />
            </div>

            <CardTitle className="text-lg font-normal">Total Users</CardTitle>
          </CardHeader>

          <CardContent className="text-4xl tracking-wider px-4">
            {userCount}
          </CardContent>
        </Card>

        {/* Blog count */}
        <Card className="py-4 gap-4">
          <CardHeader className="px-4 flex items-center gap-2.5">
            <div className="max-w-max bg-muted text-muted-foreground rounded-lg p-2">
              <Text size={18} />
            </div>

            <CardTitle className="text-lg font-normal">
              Total Articles
            </CardTitle>
          </CardHeader>

          <CardContent className="text-4xl tracking-wider px-4">
            {blogCount}
          </CardContent>
        </Card>

        {/* Comment count */}
        <Card className="py-4 gap-4">
          <CardHeader className="px-4 flex items-center gap-2.5">
            <div className="max-w-max bg-muted text-muted-foreground rounded-lg p-2">
              <MessageSquareHeart size={18} />
            </div>

            <CardTitle className="text-lg font-normal">
              Total Comments
            </CardTitle>
          </CardHeader>

          <CardContent className="text-4xl tracking-wider px-4">
            {commentCount}
          </CardContent>
        </Card>
      </div>

      {/* Recent articles: blogs table */}
      <Card className="py-4 gap-4">
        <CardHeader className="px-4 flex items-center gap-2.5">
          <div className="max-w-max bg-muted text-muted-foreground rounded-lg p-2">
            <Text size={18} />
          </div>

          <CardTitle className="text-lg font-normal">Recent Articles</CardTitle>

          <CardAction className="ml-auto">
            <Button type="button" variant="link" size="sm" asChild>
              <Link to="/admin/blogs">See all</Link>
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent className="px-4">
          <BlogsTable data={blogs} columns={columns} />
        </CardContent>
      </Card>
    </main>
  );
}

export default Dashboard;
