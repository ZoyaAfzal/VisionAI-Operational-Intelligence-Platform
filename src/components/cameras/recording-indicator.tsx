"use client";

import { formatDuration, seededSeconds } from "@/lib/time";
import { useTicker } from "@/lib/use-ticker";
import { cn } from "@/lib/utils";

const EIGHT_HOURS = 8 * 60 * 60;

/**
 * Shows the feed is actively recording- a pulsing REC dot plus a
 * duration that climbs every second. Each camera gets a different, stable
 * starting duration (seeded from its code) so a grid of live cards doesn't
 * all show the exact same clock.
 */
export function RecordingIndicator({
  seed,
  compact = false,
  className,
}: {
  seed: string;
  compact?: boolean;
  className?: string;
}) {
  const elapsed = useTicker();
  const baseSeconds = seededSeconds(seed, EIGHT_HOURS);

  return (
    <span
      className={cn(
        "mono-overlay flex items-center gap-1 rounded bg-black/60 font-semibold text-white",
        compact ? "px-1 py-0 text-[7px]" : "px-1.5 py-0.5 text-[10px]",
        className
      )}
    >
      <span className={cn("rounded-full bg-critical", compact ? "h-1 w-1" : "h-1.5 w-1.5", "animate-pulse")} />
      REC {formatDuration(baseSeconds + elapsed)}
    </span>
  );
}
