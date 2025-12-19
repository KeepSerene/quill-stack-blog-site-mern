/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 *
 * Purpose: Prevent logged-in users from accessing Login/Register page.
 */

import { redirect, type LoaderFunction } from "react-router";

const publicLoader: LoaderFunction = async () => {
  const accessToken = localStorage.getItem("access-token");

  if (accessToken) {
    return redirect("/");
  }

  return null; // allow access to the route
};

export default publicLoader;
