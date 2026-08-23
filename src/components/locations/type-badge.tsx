import { cn } from "@/lib/utils";
import type { LocationType } from "@/types";

const TYPE_STYLES: Record<LocationType, string> = {
  Restaurant: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  Mall: "bg-pink-500/15 text-pink-600 dark:text-pink-400",
  Warehouse: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
  Office: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  Store: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  "Airport Kiosk": "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400",
  "Distribution Center": "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400",
};

export function TypeBadge({ type }: { type: LocationType }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        TYPE_STYLES[type]
      )}
    >
      {type}
    </span>
  );
}
