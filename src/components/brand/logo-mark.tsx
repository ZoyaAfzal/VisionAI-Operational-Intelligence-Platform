"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * The brand mark: a lens/aperture inside four corner brackets - echoing the
 * AI bounding-box overlays used everywhere else in the product, so the logo
 * reads as "this app watches and detects" rather than a generic icon-in-a-box.
 * Interactive: the brackets spring outward and the lens ring grows slightly
 * on hover, like a camera racking focus.
 */
const CORNERS = [
  { d: "M8 13V8H13", hoverX: -1.5, hoverY: -1.5 },
  { d: "M19 8H24V13", hoverX: 1.5, hoverY: -1.5 },
  { d: "M24 19V24H19", hoverX: 1.5, hoverY: 1.5 },
  { d: "M13 24H8V19", hoverX: -1.5, hoverY: 1.5 },
];

export function LogoMark({
  size = 28,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      initial="rest"
      whileHover="hover"
      whileTap={{ scale: 0.94 }}
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="visionai-logo-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#visionai-logo-gradient)" />
      {CORNERS.map((c, i) => (
        <motion.path
          key={i}
          d={c.d}
          stroke="white"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          variants={{ rest: { x: 0, y: 0 }, hover: { x: c.hoverX, y: c.hoverY } }}
          transition={{ type: "spring", stiffness: 420, damping: 22 }}
        />
      ))}
      <motion.circle
        cx={16}
        cy={16}
        r={4}
        stroke="white"
        strokeWidth={1.75}
        fill="none"
        variants={{ rest: { scale: 1 }, hover: { scale: 1.15 } }}
        transition={{ type: "spring", stiffness: 420, damping: 18 }}
      />
      <motion.circle
        cx={16}
        cy={16}
        r={1.4}
        fill="white"
        variants={{ rest: { opacity: 0.9 }, hover: { opacity: 1 } }}
      />
    </motion.svg>
  );
}
