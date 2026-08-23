"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface PillTab {
  href: string;
  label: string;
  /** Exact-match only (don't highlight for sub-routes)- used for tabs like "Monitoring" that aren't directly linkable without an id. */
  exact?: boolean;
  disabled?: boolean;
}

export function PillTabs({ tabs, layoutId }: { tabs: PillTab[]; layoutId: string }) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
      {tabs.map((tab) => {
        const isActive = tab.exact
          ? pathname === tab.href
          : pathname === tab.href || pathname.startsWith(`${tab.href}/`);

        if (tab.disabled && !isActive) {
          return (
            <span
              key={tab.href}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground/50"
            >
              {tab.label}
            </span>
          );
        }

        if (tab.disabled && isActive) {
          return (
            <span
              key={tab.href}
              className="relative rounded-md px-3 py-1.5 text-sm font-medium text-primary-foreground"
            >
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-md bg-primary"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
              <span className="relative z-10">{tab.label}</span>
            </span>
          );
        }

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "relative rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isActive && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-md bg-primary"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
