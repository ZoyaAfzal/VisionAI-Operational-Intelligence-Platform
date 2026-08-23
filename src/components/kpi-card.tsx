import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { LineChart } from "@/components/charts/line-chart";
import { cn } from "@/lib/utils";

export function KpiCard({
  title,
  value,
  change,
  trend,
  color,
  mock,
}: {
  title: string;
  value: string;
  change: string;
  trend: number[];
  color: "success" | "critical" | "info" | "primary" | "warning";
  mock?: boolean;
}) {
  const isPositive = change.trim().startsWith("+");

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {mock && (
          <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            mock data
          </span>
        )}
      </div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          <p
            className={cn(
              "mt-1 flex items-center gap-0.5 text-xs font-medium",
              isPositive ? "text-success" : "text-critical"
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {change}
          </p>
        </div>
        <LineChart data={trend} color={color} compact className="h-10 w-20" />
      </div>
    </div>
  );
}
