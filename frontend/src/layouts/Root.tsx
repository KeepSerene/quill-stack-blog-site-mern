/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import CustomLoader from "@/components/CustomLoader";
import Header from "@/components/Header";
import { Outlet } from "react-router";
import Footer from "@/components/Footer";

function RootLayout() {
  return (
    <div className="min-h-dvh flex flex-col">
      <CustomLoader className="z-40" />

      <Header />

      <main className="grow flex flex-col">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default RootLayout;
