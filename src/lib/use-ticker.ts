"use client";

import * as React from "react";

/**
 * Seconds elapsed since this component mounted, ticking every `intervalMs`.
 * Used to make "live" wait-time numbers visibly climb instead of sitting
 * frozen at their seeded starting value.
 */
export function useTicker(intervalMs = 1000): number {
  const [elapsed, setElapsed] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => {
      setElapsed((s) => s + 1);
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return elapsed;
}
