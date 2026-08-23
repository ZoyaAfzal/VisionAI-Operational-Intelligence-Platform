"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav-items";

export function SidebarNav({
  activeAlertCount,
  onNavigate,
  layoutId = "sidebar-active-pill",
}: {
  activeAlertCount: number;
  /** Called when a nav link is clicked- used to close the mobile drawer. */
  onNavigate?: () => void;
  /** Unique per rendered instance- the desktop sidebar and the mobile
   * drawer can both be mounted at once, and Framer Motion's layoutId
   * must be unique among simultaneously-mounted elements. */
  layoutId?: string;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {isActive && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-lg bg-primary"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <Icon className="relative z-10 h-4 w-4 shrink-0" />
            <span className="relative z-10 flex-1">{item.label}</span>
            {item.badge === "alerts" && activeAlertCount > 0 && (
              <span
                className={cn(
                  "relative z-10 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-semibold",
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-critical text-critical-foreground"
                )}
              >
                {activeAlertCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
