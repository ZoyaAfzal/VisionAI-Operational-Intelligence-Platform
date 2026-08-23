import { cn } from "@/lib/utils";
import type { AlertSeverity } from "@/types";

const SEVERITY_STYLES: Record<AlertSeverity, string> = {
  Critical: "bg-critical/15 text-critical ring-1 ring-inset ring-critical/25",
  Warning: "bg-warning/15 text-warning ring-1 ring-inset ring-warning/25",
  Info: "bg-info/15 text-info ring-1 ring-inset ring-info/25",
};

export function SeverityBadge({ severity }: { severity: AlertSeverity }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        SEVERITY_STYLES[severity]
      )}
    >
      {severity}
    </span>
  );
}
