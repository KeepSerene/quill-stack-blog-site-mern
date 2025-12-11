/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type React from "react";

function Page({ children }: React.PropsWithChildren) {
  return <div className="pt-24 pb-10">{children}</div>;
}

export default Page;
