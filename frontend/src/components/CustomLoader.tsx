/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type React from "react";
import { useNavigation } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

const fadeInOut = {
  initial: { opacity: 0, translateY: -10 },
  animate: { opacity: 1, translateY: 0 },
  exit: { opacity: 0, translateY: -10 },
};

function CustomLoader({ className }: React.ComponentPropsWithoutRef<"div">) {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loader"
          role="status"
          aria-live="polite"
          aria-label="Loading..."
          className={cn(
            "bg-muted rounded-full p-2 shadow-lg fixed left-1/2 -translate-x-1/2 top-[84px]",
            className
          )}
          {...fadeInOut}
        >
          <Loader size={32} className="animate-spin" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CustomLoader;
