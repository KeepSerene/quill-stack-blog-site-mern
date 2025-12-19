/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

// React router
import { createBrowserRouter } from "react-router";

// Pages
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Home from "@/pages/users/Home";
import Blogs from "@/pages/users/Blogs";
import BlogDetails from "@/pages/users/BlogDetails";
import GlobalError from "@/pages/errors/GlobalError";
import AdminDashboard from "@/pages/admins/AdminDashboard";
import AdminBlogs from "@/pages/admins/AdminBlogs";
import AdminUsers from "@/pages/admins/AdminUsers";
import AdminComments from "@/pages/admins/AdminComments";
import AdminCreateBlog from "@/pages/admins/AdminCreateBlog";
import AdminEditBlog from "@/pages/admins/AdminEditBlog";

// Layouts
import RootLayout from "@/layouts/Root";
import AdminLayout from "@/layouts/Admin";

// Actions
import loginAction from "@/routes/actions/auth/loginAction";
import registerAction from "@/routes/actions/auth/registerAction";
import settingsAction from "@/routes/actions/users/settingsAction";
import blogEditAction from "@/routes/actions/admins/blogEditAction";
import blogCreateAction from "@/routes/actions/admins/blogCreateAction";
import blogsAction from "@/routes/actions/admins/blogsAction";
import allUsersAction from "@/routes/actions/admins/allUsersAction";

// Loaders
import refreshTokenLoader from "@/routes/loaders/refreshTokenLoader";
import homeLoader from "@/routes/loaders/users/homeLoader";
import blogsLoader from "@/routes/loaders/users/blogsLoader";
import blogDetailsLoader from "@/routes/loaders/users/blogDetailsLoader";
import adminLoader from "@/routes/loaders/admins/adminLoader";
import dashboardLoader from "@/routes/loaders/admins/dashboardLoader";
import allBlogsLoader from "@/routes/loaders/admins/allBlogsLoader";
import commentsLoader from "@/routes/loaders/admins/allCommentsLoader";
import allUsersLoader from "@/routes/loaders/admins/allUsersLoader";
import publicLoader from "@/routes/loaders/auth/publicLoader";

const router = createBrowserRouter([
  {
    ErrorBoundary: GlobalError,
    children: [
      // Auth routes
      {
        path: "/login",
        Component: Login,
        action: loginAction,
        loader: publicLoader,
      },
      {
        path: "/register",
        Component: Register,
        action: registerAction,
        loader: publicLoader,
      },
      {
        path: "/refresh-token",
        loader: refreshTokenLoader,
      },
      // Admin + user routes
      {
        path: "/",
        Component: RootLayout,
        children: [
          {
            index: true,
            Component: Home,
            loader: homeLoader,
          },
          {
            path: "blogs",
            Component: Blogs,
            loader: blogsLoader,
          },
          {
            path: "blogs/:slug",
            Component: BlogDetails,
            loader: blogDetailsLoader,
          },
        ],
      },
      // Admin routes
      {
        path: "/admin",
        Component: AdminLayout,
        loader: adminLoader,
        ErrorBoundary: GlobalError,
        children: [
          {
            path: "dashboard",
            Component: AdminDashboard,
            loader: dashboardLoader,
            handle: { breadcrumb: "Dashboard" },
          },
          {
            path: "blogs",
            Component: AdminBlogs,
            action: blogsAction,
            loader: allBlogsLoader,
            handle: { breadcrumb: "Blogs" },
          },
          {
            path: "blogs/create",
            Component: AdminCreateBlog,
            action: blogCreateAction,
            handle: { breadcrumb: "Create Blog" },
          },
          {
            path: "blogs/:slug/edit",
            Component: AdminEditBlog,
            loader: blogDetailsLoader,
            action: blogEditAction,
            handle: { breadcrumb: "Edit Blog" },
          },
          {
            path: "users",
            Component: AdminUsers,
            action: allUsersAction,
            loader: allUsersLoader,
            handle: { breadcrumb: "Users" },
          },
          {
            path: "comments",
            Component: AdminComments,
            loader: commentsLoader,
            handle: { breadcrumb: "Comments" },
          },
        ],
      },
      // Settings route
      {
        path: "/settings",
        action: settingsAction,
      },
    ],
  },
]);

export default router;
