/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type { UserDocument } from "@/types";
import { useEffect, useState } from "react";

export type UserProfile = Pick<UserDocument, "role" | "username" | "email">;

function useUser() {
  const [user, setUser] = useState<UserProfile | undefined>(() => {
    // Initialize state from localStorage on mount
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

  // listen for storage events (when localStorage is updated in other tabs)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "user") {
        if (event.newValue) {
          try {
            setUser(JSON.parse(event.newValue) as UserProfile);
          } catch (error) {
            console.error("Error parsing user data from storage event:", error);
            setUser(undefined);
          }
        } else {
          setUser(undefined);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return user;
}

export default useUser;
