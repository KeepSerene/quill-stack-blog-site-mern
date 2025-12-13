/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

const MAX_PROGRESS = 100;

function CustomTopProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(
      () => setProgress((prevVal) => prevVal + (MAX_PROGRESS - prevVal) / 5),
      100
    );

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Progress
      value={progress}
      max={MAX_PROGRESS}
      role="progressbar"
      aria-label="Page loading progress"
      aria-valuemin={0}
      aria-valuemax={MAX_PROGRESS}
      aria-valuenow={Math.round(progress)}
      className="w-auto h-1 absolute bottom-0 left-1.5 right-1.5"
    />
  );
}

export default CustomTopProgressBar;
