/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { quillStackApi } from "@/api";
import { useLocation, useNavigate } from "react-router";

function useLogOut() {
  const navigate = useNavigate();
  const location = useLocation();

  return async () => {
    const accessToken = localStorage.getItem("access-token");

    if (accessToken) {
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
    }
  };
}

export default useLogOut;
