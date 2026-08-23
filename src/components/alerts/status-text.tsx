import { cn } from "@/lib/utils";
import type { AlertStatus } from "@/types";

const STATUS_STYLES: Record<AlertStatus, string> = {
  New: "text-info",
  "In Progress": "text-primary",
  Resolved: "text-success",
};

export function StatusText({ status }: { status: AlertStatus }) {
  return (
    <span className={cn("text-sm font-medium", STATUS_STYLES[status])}>{status}</span>
  );
}
