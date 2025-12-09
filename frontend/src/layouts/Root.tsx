/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import CustomLoader from "@/components/CustomLoader";
import Header from "@/components/Header";

function RootLayout() {
  return (
    <div className="min-h-dvh flex flex-col">
      <CustomLoader className="z-40" />

      <Header />
    </div>
  );
}

export default RootLayout;
