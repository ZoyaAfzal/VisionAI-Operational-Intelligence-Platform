"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface HorizontalBarDatum {
  label: string;
  value: number;
  color: string;
}

export function HorizontalBarChart({
  data,
  max = 100,
  unit = "%",
  className,
}: {
  data: HorizontalBarDatum[];
  max?: number;
  unit?: string;
  className?: string;
}) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    // Bars start at 0% and animate to their true width on mount- this
    // needs a second paint frame, so there's no render-time equivalent.
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className={cn("space-y-3.5", className)}>
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="w-28 shrink-0 truncate text-xs text-muted-foreground">{d.label}</span>
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-[width] duration-700 ease-out"
              style={{
                width: mounted ? `${Math.max((d.value / max) * 100, 3)}%` : "0%",
                backgroundColor: d.color,
              }}
            />
          </div>
          <span className="w-12 shrink-0 text-right text-xs font-semibold tabular-nums">
            {d.value}
            {unit}
          </span>
        </div>
      ))}
    </div>
  );
}
