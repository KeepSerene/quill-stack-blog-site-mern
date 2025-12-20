/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type { UserDocument } from "@/types";
import { useEffect, useState } from "react";

export type UserProfile = Pick<UserDocument, "role" | "username" | "email">;

function useUser() {
  const [user, setUser] = useState<UserProfile | undefined>(() => {
    // initialize state from localStorage on mount
    const userJson = localStorage.getItem("user");

    if (userJson) {
      try {
        return JSON.parse(userJson) as UserProfile;
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);

        return undefined;
      }
    }

    return undefined;
  });

  // listen for storage events to update user state across components
  // the settingsLoader updates localStorage, which triggers this event
  useEffect(() => {
    // listen for custom localStorage change events in the same tab
    // this handles updates from the settings dialog immediately
    const handleCustomStorageChange = () => {
      const userJson = localStorage.getItem("user");
      if (userJson) {
        try {
          setUser(JSON.parse(userJson) as UserProfile);
        } catch (error) {
          console.error("Error parsing user data:", error);
          setUser(undefined);
        }
      } else {
        setUser(undefined);
      }
    };

    // see settingsLoader.ts
    window.addEventListener("localStorageChange", handleCustomStorageChange);

    return () => {
      window.removeEventListener(
        "localStorageChange",
        handleCustomStorageChange
      );
    };
  }, []);

  return user;
}

export default useUser;
