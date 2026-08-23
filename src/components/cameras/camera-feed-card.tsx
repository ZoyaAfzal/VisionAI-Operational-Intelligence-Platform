import Link from "next/link";
import { CameraStill } from "./camera-still";
import { BoundingBoxOverlay } from "./bounding-box-overlay";
import { QueueAnalyticsPanel } from "./queue-analytics-panel";
import { RecordingIndicator } from "./recording-indicator";
import { cn } from "@/lib/utils";
import type { Camera, Location } from "@/types";

const now = () =>
  new Date().toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export function CameraFeedCard({
  camera,
  location,
  variant,
  className,
}: {
  camera: Camera;
  location: Location;
  variant: "inventory" | "live";
  className?: string;
}) {
  const isLive = variant === "live";

  return (
    <Link
      href={`/cameras/monitoring/${camera.id}`}
      className={cn(
        "group block overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg",
        className
      )}
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        <CameraStill src={camera.image} alt={`${camera.name} live feed`} />

        {camera.boundingBoxes && camera.boundingBoxes.length > 0 && (
          <BoundingBoxOverlay boxes={camera.boundingBoxes} compact />
        )}
        {camera.queueAnalytics && (
          <QueueAnalyticsPanel data={camera.queueAnalytics} size="mini" />
        )}

        <div className="absolute left-2 top-2 flex items-center gap-1.5">
          {isLive ? (
            <span className="flex items-center gap-1 rounded bg-critical px-1.5 py-0.5 text-[10px] font-bold text-critical-foreground">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              LIVE
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  camera.status === "Active" ? "bg-success" : "bg-warning"
                )}
              />
              {camera.status}
            </span>
          )}
          <span className="rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white">
            {camera.name}
          </span>
        </div>

        <div className="absolute bottom-2 right-2 flex items-center gap-1">
          {isLive && <RecordingIndicator seed={camera.code} compact />}
          <span className="mono-overlay rounded bg-black/60 px-1.5 py-0.5 text-[9px] text-white">
            {now()}
          </span>
        </div>
        <span className="absolute bottom-2 left-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
          {location.name}
        </span>
      </div>

      {!isLive && (
        <div className="space-y-0.5 p-3">
          <p className="truncate text-sm font-semibold">{camera.name}</p>
          <p className="truncate font-mono text-[11px] text-muted-foreground">{camera.code}</p>
          <p className="truncate text-[11px] text-muted-foreground">
            {location.name} · {location.city}
          </p>
          <p className="truncate text-[11px] text-muted-foreground">
            {camera.dvrCode} · {camera.dvrBrand}
          </p>
        </div>
      )}
      {isLive && (
        <div className="p-2.5">
          <p className="truncate text-xs text-muted-foreground">{location.name}</p>
        </div>
      )}
    </Link>
  );
}
