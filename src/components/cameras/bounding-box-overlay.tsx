"use client";

import { TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseClock, formatClock } from "@/lib/time";
import { useTicker } from "@/lib/use-ticker";
import type { BoundingBox } from "@/types";

export function BoundingBoxOverlay({
  boxes,
  compact = false,
}: {
  boxes: BoundingBox[];
  compact?: boolean;
}) {
  // "Live" wait timers climb every second instead of sitting frozen at
  // their seeded starting value.
  const elapsed = useTicker();

  return (
    <div className="pointer-events-none absolute inset-0">
      {boxes.map((box) => (
        <div key={box.id}>
          <div
            className={cn(
              "absolute rounded-sm",
              compact ? "border" : "border-2",
              box.extendedWait ? "border-warning" : "border-info"
            )}
            style={{
              top: `${box.top}%`,
              left: `${box.left}%`,
              width: `${box.width}%`,
              height: `${box.height}%`,
            }}
          />
          <div
            className={cn(
              "absolute flex flex-col whitespace-nowrap rounded leading-tight text-white shadow mono-overlay",
              compact ? "px-1 py-0 text-[7px]" : "px-1.5 py-0.5 text-[10px]",
              box.extendedWait ? "bg-warning/90 text-warning-foreground" : "bg-info/90"
            )}
            style={{
              top: `calc(${box.top}% - ${compact ? 15 : 30}px)`,
              left: `${box.left}%`,
            }}
          >
            <span className="font-semibold">{box.label}</span>
            {box.waitTime && !compact && (
              <span>Waiting: {formatClock(parseClock(box.waitTime) + elapsed)}</span>
            )}
          </div>
          {box.extendedWait && !compact && (
            <div
              className="absolute flex items-center gap-1 whitespace-nowrap rounded bg-warning px-1.5 py-0.5 text-[10px] font-medium text-warning-foreground shadow"
              style={{
                top: `calc(${box.top}% + ${box.height}% + 4px)`,
                left: `${box.left}%`,
              }}
            >
              <TriangleAlert className="h-3 w-3" />
              Extended Wait Detected
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
