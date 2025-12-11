/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { cn } from "@/lib/utils";
import type { HomeLoaderResponse } from "@/routes/loaders/users/homeLoader";
import type { Variants } from "motion/react";
import type React from "react";
import { useLoaderData } from "react-router";
import { motion } from "motion/react";

const listVariant: Variants = { to: { transition: { delayChildren: 0.05 } } };

const itemVariant: Variants = {
  from: { opacity: 0 },
  to: {
    opacity: 1,
    transition: {
      duration: 1,
      ease: "backInOut",
    },
  },
};

function RecentBlogs({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"section">) {
  const { recentBlogsData } = useLoaderData<HomeLoaderResponse>();

  return (
    <section {...props} className={cn("section", className)}>
      <div className="container">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 0.5, ease: "easeOut" },
          }}
          className="section-title"
        >
          Recent Blog Posts
        </motion.h2>
      </div>
    </section>
  );
}

export default RecentBlogs;
