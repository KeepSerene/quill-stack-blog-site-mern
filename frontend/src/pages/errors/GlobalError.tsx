/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { useState } from "react";
import {
  isRouteErrorResponse,
  Navigate,
  useLocation,
  useNavigate,
  useRouteError,
} from "react-router";
import {
  AlertTriangle,
  FileQuestion,
  RefreshCcw,
  Home,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function GlobalError() {
  const error = useRouteError();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDetails, setShowDetails] = useState(false);

  // 1. Handle Token Expiration (Redirect Logic)
  if (isRouteErrorResponse(error)) {
    const hasTokenExpired =
      error.status === 401 && error.data?.includes("expired");
    if (hasTokenExpired) {
      return (
        <Navigate to={`/refresh-token?redirect=${location.pathname}`} replace />
      );
    }
  }

  // 2. Parse Error Information
  let title = "Something went wrong";
  let message = "An unexpected error occurred. Our team has been notified.";
  let status: string | number = "Error";
  let details: string | undefined = undefined;
  let is404 = false;

  if (isRouteErrorResponse(error)) {
    // Errors from Loaders or Actions (404, 500, etc.)
    status = error.status;
    is404 = error.status === 404;
    title = is404 ? "Page Not Found" : error.statusText || "Server Error";
    message = is404
      ? "The page you are looking for doesn't exist or has been moved."
      : typeof error.data === "string"
      ? error.data
      : "An error occurred while fetching data.";
  } else if (error instanceof Error) {
    // Standard Javascript runtime errors
    title = "Application Error";
    message = error.message;
    details = error.stack;
  } else if (error !== undefined && error !== null) {
    // Unknown objects thrown
    details = JSON.stringify(error);
  } else {
    // Catch-all (e.g., manual navigation to error page)
    is404 = true;
    title = "Page Not Found";
    message = "We couldn't find the page you were looking for.";
  }

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 bg-background text-foreground">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Visual icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 blur-2xl opacity-20 bg-primary animate-pulse" />

            <div className="relative bg-muted size-24 rounded-3xl flex items-center justify-center border shadow-sm">
              {is404 ? (
                <FileQuestion className="size-12 text-muted-foreground" />
              ) : (
                <AlertTriangle className="size-12 text-destructive" />
              )}
            </div>
          </div>
        </div>

        {/* Error messages */}
        <section className="space-y-2">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-destructive/10 text-destructive mb-2">
            Status {status}
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h1>

          <p className="text-muted-foreground text-balance leading-relaxed">
            {message}
          </p>
        </section>

        {/* Technical details accordion */}
        {details && (
          <div className="border rounded-lg overflow-hidden bg-card">
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-muted/50 focus-visible:bg-muted/50 transition-colors"
            >
              <span>Technical Details</span>
              <ChevronDown
                className={cn(
                  "size-4 transition-transform",
                  showDetails && "rotate-180"
                )}
              />
            </button>

            {showDetails && (
              <div className="p-4 border-t bg-muted/30">
                <pre className="text-[10px] text-left overflow-x-auto font-mono text-muted-foreground max-h-40 custom-scrollbar">
                  {details}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center pt-4">
          <Button
            type="button"
            size="lg"
            className="w-full sm:w-auto gap-2"
            onClick={handleGoBack}
          >
            <ArrowLeft className="size-4" />
            Go Back
          </Button>

          <Button
            variant="default"
            size="lg"
            className="w-full sm:w-auto gap-2 shadow-lg shadow-primary/20"
            onClick={() => navigate("/")}
          >
            <Home className="size-4" />
            Return Home
          </Button>
        </div>

        {/* Support link */}
        <p className="text-xs text-muted-foreground">
          If you believe this is a bug, please{" "}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="underline underline-offset-4 hover:text-primary focus-visible:text-primary inline-flex items-center gap-1"
          >
            <RefreshCcw className="size-3" /> retry the action
          </button>
          .
        </p>
      </div>
    </main>
  );
}

export default GlobalError;
