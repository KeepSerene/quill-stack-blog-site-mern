/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type { User } from "@/types";
import { useEffect, useState } from "react";

export type UserProfile = Pick<User, "role" | "username" | "email">;

function useUser() {
  const [user, setUser] = useState<UserProfile>();

  useEffect(() => {
    const userJson = localStorage.getItem("user");

    if (userJson) {
      const userInfo = JSON.parse(userJson) as UserProfile;
      setUser(userInfo);
    }
  }, []);

  return user;
}

export default useUser;
