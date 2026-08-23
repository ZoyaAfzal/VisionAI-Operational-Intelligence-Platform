"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Alert, Location } from "@/types";

const SEVERITY_DOT: Record<Alert["severity"], string> = {
  Critical: "bg-critical",
  Warning: "bg-warning",
  Info: "bg-info",
};

export function NotificationsMenu({
  alerts,
  locationsById,
}: {
  alerts: Alert[];
  locationsById: Map<string, Location>;
}) {
  const recent = alerts.filter((a) => a.status !== "Resolved").slice(0, 5);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          {recent.length > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-critical px-1 text-[10px] font-semibold text-critical-foreground">
              {alerts.filter((a) => a.status !== "Resolved").length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Active Alerts</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {recent.map((alert) => (
          <DropdownMenuItem key={alert.id} asChild>
            <Link href="/alerts" className="flex items-start gap-2 py-2">
              <span
                className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", SEVERITY_DOT[alert.severity])}
              />
              <div className="min-w-0">
                <p className="truncate text-sm">{alert.type}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {locationsById.get(alert.locationId)?.name} · {alert.time}
                </p>
              </div>
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/alerts" className="justify-center text-sm text-primary">
            View all alerts
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
