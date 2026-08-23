"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { SeriesPoint } from "@/types";

const COLOR_VAR: Record<string, string> = {
  success: "var(--color-success)",
  critical: "var(--color-critical)",
  info: "var(--color-info)",
  primary: "var(--color-primary)",
  warning: "var(--color-warning)",
};

type Point = number | SeriesPoint;
type Coord = readonly [number, number];

function toValue(p: Point) {
  return typeof p === "number" ? p : p.value;
}

/**
 * Monotone cubic (Fritsch-Carlson) interpolation- the same family of
 * curve used by most polished dashboard charts (d3's curveMonotoneX).
 * Unlike a naive Catmull-Rom smoothing, it never overshoots past a
 * segment's own endpoints, so sparse/spiky data (e.g. 7 day-of-week
 * points) still reads as a clean trend line instead of a jagged EKG
 * zigzag or a curve that balloons past local peaks/valleys.
 */
function monotonePath(points: Coord[]): string {
  const n = points.length;
  if (n === 0) return "";
  if (n === 1) return `M ${points[0][0]} ${points[0][1]}`;

  const dx: number[] = [];
  const slope: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    const d = points[i + 1][0] - points[i][0];
    dx.push(d);
    slope.push(d === 0 ? 0 : (points[i + 1][1] - points[i][1]) / d);
  }

  const tangent: number[] = new Array(n).fill(0);
  tangent[0] = slope[0];
  tangent[n - 1] = slope[n - 2];
  for (let i = 1; i < n - 1; i++) {
    if (slope[i - 1] === 0 || slope[i] === 0 || slope[i - 1] * slope[i] < 0) {
      tangent[i] = 0;
    } else {
      tangent[i] = (slope[i - 1] + slope[i]) / 2;
    }
  }

  for (let i = 0; i < n - 1; i++) {
    if (slope[i] === 0) {
      tangent[i] = 0;
      tangent[i + 1] = 0;
      continue;
    }
    const a = tangent[i] / slope[i];
    const b = tangent[i + 1] / slope[i];
    const s = a * a + b * b;
    if (s > 9) {
      const tau = 3 / Math.sqrt(s);
      tangent[i] = tau * a * slope[i];
      tangent[i + 1] = tau * b * slope[i];
    }
  }

  let path = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const d = dx[i] / 3;
    const cp1x = x0 + d;
    const cp1y = y0 + tangent[i] * d;
    const cp2x = x1 - d;
    const cp2y = y1 - tangent[i + 1] * d;
    path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)} ${cp2x.toFixed(1)} ${cp2y.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  }
  return path;
}

/**
 * Minimal hand-rolled line chart. Handles both a full chart (with x-axis
 * labels, a dotted mid-line reference, and a hover crosshair/tooltip) and
 * a compact sparkline mode- one scaling implementation for both, since a
 * sparkline is the same point-to-path math with the chrome turned off.
 */
export function LineChart({
  data,
  color = "info",
  compact = false,
  unit = "",
  decimals = 0,
  className,
}: {
  data: Point[];
  color?: keyof typeof COLOR_VAR;
  compact?: boolean;
  /** Suffix appended to the tooltip value, e.g. " min", " visitors". */
  unit?: string;
  /** Decimal places shown in the tooltip value. */
  decimals?: number;
  className?: string;
}) {
  const gradientId = React.useId();
  const svgRef = React.useRef<SVGSVGElement>(null);
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);

  const width = 300;
  const height = compact ? 40 : 140;
  const labelSpace = compact ? 0 : 16;
  const chartHeight = height - labelSpace;
  const padY = compact ? 3 : 10;
  const padX = compact ? 0 : 4;

  const values = data.map(toValue);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const points: Coord[] = values.map((v, i) => {
    const x = padX + (i / (values.length - 1 || 1)) * (width - padX * 2);
    const y = chartHeight - padY - ((v - min) / range) * (chartHeight - padY * 2);
    return [x, y] as const;
  });

  const linePath = monotonePath(points);
  const areaPath = `${linePath} L ${points[points.length - 1][0].toFixed(1)} ${chartHeight} L ${points[0][0].toFixed(1)} ${chartHeight} Z`;

  const strokeColor = COLOR_VAR[color];

  function handleMove(e: React.MouseEvent<SVGSVGElement>) {
    if (compact) return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * width;
    let nearest = 0;
    let nearestDist = Infinity;
    points.forEach(([x], i) => {
      const d = Math.abs(x - svgX);
      if (d < nearestDist) {
        nearestDist = d;
        nearest = i;
      }
    });
    setHoverIndex(nearest);
  }

  const hovered = hoverIndex !== null ? points[hoverIndex] : null;
  const hoveredPoint = hoverIndex !== null ? data[hoverIndex] : null;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("w-full", !compact && "cursor-crosshair", className)}
      preserveAspectRatio="none"
      onMouseMove={handleMove}
      onMouseLeave={() => setHoverIndex(null)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity={0.35} />
          <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
        </linearGradient>
      </defs>

      {!compact && (
        <line
          x1={padX}
          x2={width - padX}
          y1={chartHeight / 2}
          y2={chartHeight / 2}
          stroke="currentColor"
          className="text-border"
          strokeDasharray="3 4"
          strokeWidth={1}
        />
      )}

      <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
      <path
        d={linePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={compact ? 1.75 : 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {!compact &&
        points.map(([x, y], i) => (
          <circle
            key={`dot-${i}`}
            cx={x}
            cy={y}
            r={i === hoverIndex ? 3.5 : 2.5}
            fill={strokeColor}
            className="transition-[r]"
          />
        ))}

      {!compact &&
        data.map((p, i) => {
          const showEvery = data.length > 8 ? 2 : 1;
          if (typeof p !== "object" || i % showEvery !== 0) return null;
          const anchor = i === 0 ? "start" : i === data.length - 1 ? "end" : "middle";
          return (
            <text
              key={i}
              x={points[i][0]}
              y={height - 4}
              fontSize={9}
              textAnchor={anchor}
              className="fill-muted-foreground"
            >
              {p.label}
            </text>
          );
        })}

      {!compact && hovered && hoveredPoint !== null && (
        <g pointerEvents="none">
          <line
            x1={hovered[0]}
            x2={hovered[0]}
            y1={0}
            y2={chartHeight}
            stroke={strokeColor}
            strokeOpacity={0.35}
            strokeDasharray="2 3"
            strokeWidth={1}
          />
          <circle cx={hovered[0]} cy={hovered[1]} r={4.5} fill={strokeColor} stroke="var(--color-card)" strokeWidth={1.5} />
          <ChartTooltip
            x={hovered[0]}
            y={hovered[1]}
            chartWidth={width}
            label={typeof hoveredPoint === "object" ? hoveredPoint.label : ""}
            value={`${toValue(hoveredPoint).toFixed(decimals)}${unit}`}
          />
        </g>
      )}
    </svg>
  );
}

function ChartTooltip({
  x,
  y,
  chartWidth,
  label,
  value,
}: {
  x: number;
  y: number;
  chartWidth: number;
  label: string;
  value: string;
}) {
  const boxWidth = Math.max(38, value.length * 6 + 16);
  const boxHeight = 28;
  const tx = Math.max(2, Math.min(chartWidth - boxWidth - 2, x - boxWidth / 2));
  const ty = y - boxHeight - 10 < 0 ? y + 10 : y - boxHeight - 10;

  return (
    <g>
      <rect
        x={tx}
        y={ty}
        width={boxWidth}
        height={boxHeight}
        rx={5}
        fill="var(--popover)"
        stroke="var(--border)"
        strokeWidth={1}
      />
      <text x={tx + boxWidth / 2} y={ty + 11} textAnchor="middle" fontSize={8} className="fill-muted-foreground">
        {label}
      </text>
      <text
        x={tx + boxWidth / 2}
        y={ty + 22}
        textAnchor="middle"
        fontSize={10}
        fontWeight={600}
        className="fill-foreground"
      >
        {value}
      </text>
    </g>
  );
}
