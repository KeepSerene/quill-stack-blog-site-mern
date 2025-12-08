/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

// React router
import { createBrowserRouter } from "react-router";

// Pages
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

// Actions
import registerAction from "@/routes/actions/register";

const router = createBrowserRouter([
  // Auth routes
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
    action: registerAction,
  },
  // Admin + user routes
  {
    path: "/",
    children: [
      {
        index: true,
      },
      {
        path: "blogs",
      },
      {
        path: "blogs/:slug",
      },
    ],
  },
  {
    path: "/settings",
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
