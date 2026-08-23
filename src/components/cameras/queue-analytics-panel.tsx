"use client";

import { Users, Clock, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseClock, formatClock } from "@/lib/time";
import { useTicker } from "@/lib/use-ticker";
import type { QueueAnalytics } from "@/types";

export function QueueAnalyticsPanel({
  data,
  size = "full",
  className,
}: {
  data: QueueAnalytics;
  size?: "mini" | "full";
  className?: string;
}) {
  const isMini = size === "mini";
  const elapsed = useTicker();

  const liveAvgWait = formatClock(parseClock(data.avgWaitTime) + elapsed);
  // Gentle deterministic oscillation so the queue length feels alive
  // without jumping around erratically.
  const liveQueueLength = Math.max(0, data.queueLength + Math.round(Math.sin(elapsed / 12) * 2));

  return (
    <div
      className={cn(
        "glass-panel absolute right-2 top-2 rounded-md text-white shadow-lg",
        isMini ? "w-28 p-1.5" : "w-44 p-3",
        className
      )}
    >
      <p
        className={cn(
          "mb-1.5 flex items-center gap-1 font-semibold uppercase tracking-wide text-info",
          isMini ? "text-[8px]" : "text-[10px]"
        )}
      >
        <TrendingUp className={isMini ? "h-2 w-2" : "h-3 w-3"} />
        Queue Analytics
      </p>
      <dl className={cn("space-y-1", isMini ? "text-[9px]" : "text-xs")}>
        <div className="flex items-center justify-between gap-2">
          <dt className="flex items-center gap-1 text-white/60">
            <Users className={isMini ? "h-2.5 w-2.5" : "h-3 w-3"} />
            {isMini ? "Len" : "Queue Length"}
          </dt>
          <dd className="font-semibold tabular-nums">{liveQueueLength}</dd>
        </div>
        <div className="flex items-center justify-between gap-2">
          <dt className="flex items-center gap-1 text-white/60">
            <Clock className={isMini ? "h-2.5 w-2.5" : "h-3 w-3"} />
            {isMini ? "Avg" : "Average Wait Time"}
          </dt>
          <dd className="font-semibold mono-overlay">{liveAvgWait}</dd>
        </div>
        {!isMini && (
          <div className="flex items-center justify-between gap-2">
            <dt className="text-white/60">Predicted Wait:</dt>
            <dd className="font-semibold mono-overlay">{data.predictedWait}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
