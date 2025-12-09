import "./index.css";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { RouterProvider } from "react-router";
import router from "@/routes/router";
import { Toaster } from "@/components/ui/sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
      <RouterProvider router={router} />
      <Toaster richColors position="bottom-right" duration={3000} />
    </ThemeProvider>
  </StrictMode>
);
