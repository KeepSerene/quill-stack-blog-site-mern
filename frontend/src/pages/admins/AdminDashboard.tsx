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
import { Fragment } from "react";
import CommentCard from "@/components/CommentCard";
import { Separator } from "@/components/ui/separator";
import UserCard from "@/components/UserCard";
import type { BlogDocument, UserDocument } from "@/types";

function AdminDashboard() {
  const { users, userCount, blogs, blogCount, comments, commentCount } =
    useLoaderData() as DashboardLoaderResponse;
  const currentUser = useUser();

  return (
    <main className="container p-4 space-y-4">
      <h2 className="text-2xl font-semibold">Overview</h2>

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

      {/* Recent comments + New users */}
      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-4">
        {/* Recent comments */}
        <Card className="py-4 gap-4">
          <CardHeader className="px-4 flex items-center gap-2.5">
            <div className="max-w-max bg-muted text-muted-foreground rounded-lg p-2">
              <MessageSquareHeart size={18} />
            </div>

            <CardTitle className="text-lg font-normal">
              Recent Comments
            </CardTitle>

            <CardAction className="ml-auto">
              <Button type="button" variant="link" size="sm" asChild>
                <Link to="/admin/comments">See all</Link>
              </Button>
            </CardAction>
          </CardHeader>

          <CardContent className="px-4">
            {comments.map(
              (
                { _id, user, blog, content, likeCount, createdAt },
                index,
                array
              ) => (
                <Fragment key={_id}>
                  <CommentCard
                    user={user as UserDocument}
                    blog={blog as BlogDocument}
                    content={content}
                    likeCount={likeCount}
                    createdAt={createdAt}
                  />

                  {index < array.length - 1 && <Separator className="my-1" />}
                </Fragment>
              )
            )}
          </CardContent>
        </Card>

        {/* New users */}
        <Card className="py-4 gap-4">
          <CardHeader className="px-4 flex items-center gap-2.5">
            <div className="max-w-max bg-muted text-muted-foreground rounded-lg p-2">
              <Users2 size={18} />
            </div>

            <CardTitle className="text-lg font-normal">New Users</CardTitle>

            <CardAction className="ml-auto">
              <Button type="button" variant="link" size="sm" asChild>
                <Link to="/admin/users">See all</Link>
              </Button>
            </CardAction>
          </CardHeader>

          <CardContent className="px-4">
            {users.map(
              ({
                _id,
                role,
                username,
                firstName,
                lastName,
                email,
                createdAt,
              }) => (
                <UserCard
                  key={_id}
                  userId={_id}
                  role={role}
                  username={username}
                  firstName={firstName}
                  lastName={lastName}
                  email={email}
                  createdAt={createdAt}
                  currentUser={currentUser}
                />
              )
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default AdminDashboard;
