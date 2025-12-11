/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import { cn } from "@/lib/utils";
import type { Variants } from "motion/react";
import { motion } from "motion/react";
import type React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const HERO_TEXTS = {
  title: "Words Crafted, Insights Layered",
  subtitle:
    "A curated space for voices, stories, and ideas that stack up to something bigger.",
} as const;

const containerVariant: Variants = {
  to: { transition: { delayChildren: 0.05 } },
};

const childVariant: Variants = {
  from: { opacity: 0, filter: "blur(10px)" },
  to: {
    opacity: 1,
    filter: "blur(0)",
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

function Hero({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"section">) {
  return (
    <section {...props} className={cn("section", className)}>
      <motion.div
        initial="from"
        whileInView="to"
        viewport={{ once: true }}
        variants={containerVariant}
        className="container"
      >
        <motion.h1
          variants={childVariant}
          className="text-3xl md:text-4xl xl:text-5xl font-semibold text-center text-balance"
        >
          {HERO_TEXTS.title}
        </motion.h1>

        <motion.p
          variants={childVariant}
          className="text-muted-foreground md:text-xl text-center text-balance mt-5 mb-8"
        >
          {HERO_TEXTS.subtitle}
        </motion.p>

        <motion.div
          variants={childVariant}
          className="max-w-md mx-auto flex items-center gap-2"
        >
          <Input
            type="email"
            name="email"
            autoComplete="email"
            aria-label="Enter your email"
            placeholder="Enter your email"
          />

          <Button type="button">Subscribe</Button>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default Hero;
