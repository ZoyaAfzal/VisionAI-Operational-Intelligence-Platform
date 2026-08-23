import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CameraStill } from "./camera-still";
import { BoundingBoxOverlay } from "./bounding-box-overlay";
import { QueueAnalyticsPanel } from "./queue-analytics-panel";
import { RecordingIndicator } from "./recording-indicator";
import { cn } from "@/lib/utils";
import type { Camera, Location } from "@/types";

export function MonitoringView({ camera, location }: { camera: Camera; location: Location }) {
  const isActive = camera.status === "Active";
  const timestamp = new Date().toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <div>
      <Link
        href="/cameras"
        className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Inventory
      </Link>

      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{camera.name}</h1>
          <p className="text-sm text-muted-foreground">
            {location.name} · {camera.code}
          </p>
        </div>
        <span
          className={cn(
            "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
            isActive ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", isActive ? "bg-success" : "bg-warning")} />
          {camera.status}
        </span>
      </div>

      <div className="relative mx-auto aspect-video max-w-4xl overflow-hidden rounded-lg border border-border bg-black">
        <CameraStill src={camera.image} alt={`${camera.name} monitoring feed`} />

        {isActive && camera.boundingBoxes && camera.boundingBoxes.length > 0 && (
          <BoundingBoxOverlay boxes={camera.boundingBoxes} />
        )}
        {isActive && camera.queueAnalytics && <QueueAnalyticsPanel data={camera.queueAnalytics} />}

        <div className="absolute left-3 top-3 flex items-center gap-1.5">
          {isActive && (
            <span className="flex items-center gap-1 rounded bg-critical px-1.5 py-0.5 text-[10px] font-bold text-critical-foreground">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              LIVE
            </span>
          )}
          <span className="rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white">
            {camera.name}
          </span>
        </div>
        <p className="mono-overlay absolute left-3 top-9 rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white">
          {timestamp}
        </p>

        <span className="absolute bottom-3 left-3 rounded bg-black/60 px-1.5 py-0.5 text-xs text-white">
          {location.name}
        </span>
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
          {isActive && <RecordingIndicator seed={camera.code} />}
          <span className="mono-overlay rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
            {timestamp}
          </span>
        </div>
      </div>
    </div>
  );
}
