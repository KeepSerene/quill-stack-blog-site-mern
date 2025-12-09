/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type { User } from "@/types";
import { useEffect, useState } from "react";

export type UserDocument = Pick<User, "role" | "username" | "email">;

function useUser() {
  const [user, setUser] = useState<UserDocument>();

  useEffect(() => {
    const userJson = localStorage.getItem("user");

    if (userJson) {
      const userInfo = JSON.parse(userJson) as UserDocument;
      setUser(userInfo);
    }
  }, []);

  return user;
}

export default useUser;
