/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { quillStackApi } from "@/api";
import { redirect, type LoaderFunction } from "react-router";

// Loader to fetch fresh user data after settings update
const settingsLoader: LoaderFunction = async () => {
  const accessToken = localStorage.getItem("access-token");

  if (!accessToken) {
    return redirect("/login");
  }

  try {
    const response = await quillStackApi.get("/users/current", {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true,
    });
    const userData = response.data.user;

    // update localStorage with fresh user data
    localStorage.setItem("user", JSON.stringify(userData));

    // dispatch custom event to notify useUser hook about the update
    // this triggers immediate UI updates in navbar/user menu
    window.dispatchEvent(new Event("localStorageChange"));

    return { user: userData };
  } catch (error) {
    console.error("Error fetching current user:", error);

    // return null if fetch fails, don't block the route
    return null;
  }
};

export default settingsLoader;
