/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type React from "react";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";
import Logo from "@/components/Logo";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

const SOCIAL_LINKS = [
  {
    href: "https://math-to-dev.vercel.app/",
    label: "Portfolio",
    icon: Globe,
    imgSrc: "",
  },
  {
    href: "https://github.com/KeepSerene",
    label: "GitHub",
    icon: null,
    imgSrc: "/social-icons/github.svg",
  },
  {
    href: "https://www.linkedin.com/in/dhrubajyoti-bhattacharjee-320822318/",
    label: "LinkedIn",
    icon: null,
    imgSrc: "/social-icons/linkedin.svg",
  },
  {
    href: "https://x.com/UsualLearner",
    label: "X",
    icon: null,
    imgSrc: "/social-icons/x.svg",
  },
] as const;

function Footer({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"footer">) {
  return (
    <footer {...props} className={cn("border-t", className)}>
      <div className="container py-4 grid grid-cols-1 md:grid-cols-[1fr_3fr_1fr] max-md:justify-items-center md:items-center">
        <Logo size="sm" />

        <p className="md:justify-self-center order-1 md:order-0 text-muted-foreground text-xs md:text-sm max-md:text-center">
          &copy; {new Date().getFullYear()} KeepSerene. All Rights Reserved.
        </p>

        <ul className="max-md:my-1 flex md:justify-self-end items-center gap-1">
          {SOCIAL_LINKS.map(({ href, icon: Icon, label, imgSrc }) => (
            <li key={label}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={label}
                    asChild
                  >
                    <a href={href} target="_blank">
                      {Icon ? (
                        <Icon className="size-4" />
                      ) : (
                        <img
                          src={imgSrc}
                          alt={`${label} icon`}
                          className="size-4 brightness-0 dark:invert"
                        />
                      )}
                    </a>
                  </Button>
                </TooltipTrigger>

                <TooltipContent>{label}</TooltipContent>
              </Tooltip>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
