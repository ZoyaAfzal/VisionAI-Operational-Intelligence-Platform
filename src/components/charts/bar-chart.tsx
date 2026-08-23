"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { SeriesPoint } from "@/types";

export function BarChart({
  data,
  className,
}: {
  data: SeriesPoint[];
  className?: string;
}) {
  const [hovered, setHovered] = React.useState<string | null>(null);
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={cn("flex h-36 gap-3 px-1", className)}>
      {data.map((d) => (
        <div
          key={d.label}
          className="flex h-full flex-1 flex-col items-center justify-end gap-2"
          onMouseEnter={() => setHovered(d.label)}
          onMouseLeave={() => setHovered((h) => (h === d.label ? null : h))}
        >
          <span
            className={cn(
              "text-[10px] font-semibold tabular-nums transition-colors",
              hovered === d.label ? "text-critical" : "text-muted-foreground"
            )}
          >
            {d.value}
          </span>
          <div
            className={cn(
              "w-full max-w-10 rounded-t-sm transition-colors",
              hovered === d.label ? "bg-critical" : "bg-critical/80"
            )}
            style={{ height: `${Math.max((d.value / max) * 100, 4)}%` }}
          />
          <span className="text-[10px] text-muted-foreground">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
