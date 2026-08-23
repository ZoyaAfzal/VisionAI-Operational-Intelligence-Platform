"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const FALLBACK_SRC = "/cameras/fallback.svg";

/**
 * The single place a camera frame is ever rendered. A real <img onError>,
 * never a CSS background-image (which fails silently transparent- the
 * exact way a dark card produces a "black frame" when the source is bad).
 * On error it swaps to a local generated placeholder so a broken/missing
 * image can never render as a blank box.
 */
export function CameraStill({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [currentSrc, setCurrentSrc] = React.useState(src);
  const [trackedSrc, setTrackedSrc] = React.useState(src);

  // Reset to the new src when the prop changes (e.g. navigating between
  // cameras)- adjusted during render rather than in an effect, per
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (src !== trackedSrc) {
    setTrackedSrc(src);
    setCurrentSrc(src);
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- fixed-size decorative feed stills; onError fallback is the point
    <img
      src={currentSrc}
      alt={alt}
      onError={() => {
        if (currentSrc !== FALLBACK_SRC) setCurrentSrc(FALLBACK_SRC);
      }}
      className={cn("h-full w-full object-cover", className)}
      draggable={false}
    />
  );
}
