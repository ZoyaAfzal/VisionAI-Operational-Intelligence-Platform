import { CameraOff } from "lucide-react";
import type { Camera, Location } from "@/types";

export function InactiveCameraCard({
  camera,
  location,
}: {
  camera: Camera;
  location: Location;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card opacity-70">
      <div className="flex aspect-video flex-col items-center justify-center gap-2 bg-black/40">
        <div className="relative">
          <CameraOff className="h-7 w-7 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          Camera {camera.status === "Disabled" ? "disabled" : "inactive"}
        </p>
        <p className="text-xs text-muted-foreground/70">No live feed available</p>
      </div>
      <div className="p-2.5">
        <p className="truncate text-xs text-muted-foreground">{location.name}</p>
      </div>
    </div>
  );
}
