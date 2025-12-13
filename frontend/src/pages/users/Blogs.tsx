/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { cn } from "@/lib/utils";
import type { Variants } from "motion/react";
import type React from "react";
import { useLoaderData } from "react-router";
import Page from "@/components/Page";
import { motion } from "motion/react";
import BlogCard from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import type { BlogDocument, PaginatedResponse } from "@/types";

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

function Blogs({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"section">) {
  const loaderData = useLoaderData() as PaginatedResponse<
    BlogDocument,
    "blogs"
  >;
  const { data: blogsData } = loaderData;

  return (
    <Page>
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
            Blog Posts
          </motion.h2>

          <motion.ul
            initial="from"
            whileInView="to"
            viewport={{ once: true }}
            variants={listVariant}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {blogsData.blogs.map(
              ({ title, content, author, banner, slug, publishedAt }) => (
                <motion.li key={slug} variants={itemVariant}>
                  <BlogCard
                    bannerUrl={banner.url}
                    bannerWidth={banner.width}
                    bannerHeight={banner.height}
                    title={title}
                    content={content}
                    slug={slug}
                    authorName={`${author.firstName} ${author.lastName}`}
                    publishedAt={publishedAt}
                  />
                </motion.li>
              )
            )}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.5, ease: "backInOut" },
            }}
            className="mt-8 md:mt-10 flex justify-center"
          >
            <Button type="button" size="lg" asChild>
              See all
            </Button>
          </motion.div>
        </div>
      </section>
    </Page>
  );
}

export default Blogs;
