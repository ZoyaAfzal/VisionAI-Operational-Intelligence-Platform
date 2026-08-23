import { cn } from "@/lib/utils";
import type { LocationStatus } from "@/types";

const STATUS_STYLES: Record<LocationStatus, string> = {
  Active: "bg-success/15 text-success",
  Maintenance: "bg-warning/15 text-warning",
  Inactive: "bg-muted text-muted-foreground",
};

export function LocationStatusBadge({ status }: { status: LocationStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        STATUS_STYLES[status]
      )}
    >
      {status}
    </span>
  );
}
