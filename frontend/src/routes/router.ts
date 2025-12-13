/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

// React router
import { createBrowserRouter } from "react-router";

// Pages
import LoginPage from "@/pages/auth/Login";
import RegisterPage from "@/pages/auth/Register";
import Home from "@/pages/users/Home";
import Blogs from "@/pages/users/Blogs";
import BlogDetails from "@/pages/users/BlogDetails";

// Layouts
import RootLayout from "@/layouts/Root";
import AdminLayout from "@/layouts/Admin";

// Actions
import loginAction from "@/routes/actions/login";
import registerAction from "@/routes/actions/register";
import settingsAction from "@/routes/actions/settings";

// Loaders
import refreshTokenLoader from "@/routes/loaders/refreshTokenLoader";
import homeLoader from "@/routes/loaders/users/homeLoader";
import blogsLoader from "@/routes/loaders/users/blogsLoader";
import blogDetailsLoader from "@/routes/loaders/users/blogDetailsLoader";

const router = createBrowserRouter([
  // Auth routes
  {
    path: "/login",
    Component: LoginPage,
    action: loginAction,
  },
  {
    path: "/register",
    Component: RegisterPage,
    action: registerAction,
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
    children: [
      {
        path: "dashboard",
        handle: { breadcrumb: "Dashboard" },
      },
      {
        path: "blogs",
        handle: { breadcrumb: "Blogs" },
      },
      {
        path: "blogs/create",
        handle: { breadcrumb: "Create Blog" },
      },
      {
        path: "blogs/:slug/edit",
        handle: { breadcrumb: "Edit Blog" },
      },
      {
        path: "users",
        handle: { breadcrumb: "Users" },
      },
      {
        path: "comments",
        handle: { breadcrumb: "Comments" },
      },
    ],
  },
  // Settings route
  {
    path: "/settings",
    action: settingsAction,
  },
]);

export default router;
