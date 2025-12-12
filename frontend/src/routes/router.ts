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

// Layouts
import RootLayout from "@/layouts/Root";

// Actions
import loginAction from "@/routes/actions/login";
import registerAction from "@/routes/actions/register";
import settingsAction from "@/routes/actions/settings";

// Loaders
import refreshTokenLoader from "@/routes/loaders/refreshTokenLoader";
import homeLoader from "@/routes/loaders/users/homeLoader";
import Blogs from "@/pages/users/Blogs";

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
      },
      {
        path: "blogs/:slug",
      },
    ],
  },
  {
    path: "/settings",
    action: settingsAction,
  },
  // Admin routes
  {
    path: "/admin",
    children: [
      {
        path: "dashboard",
      },
      {
        path: "blogs",
      },
      {
        path: "blogs/create",
      },
      {
        path: "blogs/:slug/edit",
      },
      {
        path: "users",
      },
      {
        path: "comments",
      },
    ],
  },
]);

export default router;
