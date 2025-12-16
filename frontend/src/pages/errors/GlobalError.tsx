/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { Button } from "@/components/ui/button";
import {
  isRouteErrorResponse,
  Navigate,
  useLocation,
  useNavigate,
  useRouteError,
} from "react-router";

function GlobalError() {
  const error = useRouteError();
  const navigate = useNavigate();
  const location = useLocation();

  if (isRouteErrorResponse(error)) {
    const hasTokenExpired =
      error.status === 401 && error.data?.includes("expired");

    if (hasTokenExpired) {
      return <Navigate to={`/refresh-token?redirect=${location.pathname}`} />;
    }

    return (
      <main className="h-dvh grid place-content-center place-items-center gap-4">
        <h1 className="text-4xl font-semibold">
          {error.status} &mdash; {error.statusText}
        </h1>

        <p className="max-w-[60ch] text-muted-foreground text-center text-balance">
          {error.data}
        </p>

        <Button type="button" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </main>
    );
  } else if (error instanceof Error) {
    return (
      <main className="h-dvh grid place-content-center place-items-center gap-4">
        <h1 className="text-4xl font-semibold">Error</h1>

        <p className="max-w-[60ch] text-muted-foreground text-center text-balance">
          {error.message}
        </p>

        <p className="max-w-[60ch] text-muted-foreground text-center text-balance">
          The stack trace is:
        </p>

        <pre>{error.stack}</pre>
      </main>
    );
  } else {
    return (
      <main className="h-dvh grid place-content-center place-items-center gap-4">
        <h1 className="text-4xl font-semibold">Unknown Error</h1>
      </main>
    );
  }
}

export default GlobalError;
