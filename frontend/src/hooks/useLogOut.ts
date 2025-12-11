/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { quillStackApi } from "@/api";
import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router";

function useLogOut() {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(async () => {
    const accessToken = localStorage.getItem("access-token");

    if (accessToken) {
      try {
        const response = await quillStackApi.post(
          "/auth/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          }
        );

        if (response.status >= 400) return;

        localStorage.removeItem("access-token");
        localStorage.removeItem("user");

        if (location.pathname === "/") {
          window.location.reload();

          return;
        }

        navigate("/", { replace: true, viewTransition: true });
      } catch (error) {
        console.error("Error during logout:", error);
        // still clear local storage even if API call fails
        localStorage.removeItem("access-token");
        localStorage.removeItem("user");
        navigate("/", { replace: true, viewTransition: true });
      }
    }
  }, [navigate, location.pathname]);
}

export default useLogOut;
