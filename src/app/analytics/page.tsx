import { LineChart } from "@/components/charts/line-chart";
import { BarChart } from "@/components/charts/bar-chart";
import { HorizontalBarChart } from "@/components/charts/horizontal-bar-chart";
import { MockDisclaimer } from "@/components/mock-disclaimer";
import {
  footfallTrend,
  queueTimeTrend,
  complianceViolations,
  locationComparison,
  getLocation,
} from "@/data/mockData";

export default function AnalyticsPage() {
  const comparisonData = locationComparison.map((c) => ({
    label: getLocation(c.locationId)?.name ?? c.locationId,
    value: c.value,
    color: c.color,
  }));

  const footfallPeak = footfallTrend.reduce((a, b) => (b.value > a.value ? b : a));
  const queueCurrent = queueTimeTrend[queueTimeTrend.length - 1];
  const totalViolations = complianceViolations.reduce((sum, d) => sum + d.value, 0);
  const topLocation = comparisonData.reduce((a, b) => (b.value > a.value ? b : a));

  return (
    <div className="space-y-4 p-6">
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div>
            <h2 className="text-base font-semibold">Analytics Overview</h2>
            <p className="text-xs text-muted-foreground">
              Operational trends across all locations, last 12 hours and 7 days.
            </p>
          </div>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            mock data
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 p-4 lg:grid-cols-2">
          <ChartCard
            title="Footfall Trend"
            statLabel="Peak"
            statValue={`${footfallPeak.value} at ${footfallPeak.label}`}
          >
            <LineChart data={footfallTrend} color="info" unit=" visitors" />
          </ChartCard>
          <ChartCard title="Queue Time (Avg.)" statLabel="Current" statValue={`${queueCurrent.value} min`}>
            <LineChart data={queueTimeTrend} color="primary" unit=" min" decimals={1} />
          </ChartCard>
          <ChartCard title="Compliance Violations" statLabel="This week" statValue={String(totalViolations)}>
            <BarChart data={complianceViolations} />
          </ChartCard>
          <ChartCard title="Location Comparison" statLabel="Top" statValue={topLocation.label}>
            <HorizontalBarChart data={comparisonData} className="pt-2" />
          </ChartCard>
        </div>
      </div>

      <MockDisclaimer>
        Chart time-series data is from{" "}
        <code className="rounded bg-info/10 px-1 py-0.5 font-mono text-info">
          src/data/mockData.js
        </code>
        . Add a{" "}
        <code className="rounded bg-muted px-1 py-0.5 font-mono">GET /metrics/history</code>{" "}
        endpoint to serve real analytics.
      </MockDisclaimer>
    </div>
  );
}

function ChartCard({
  title,
  statLabel,
  statValue,
  children,
}: {
  title: string;
  statLabel: string;
  statValue: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border p-4 transition-colors hover:border-muted-foreground/30">
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold">{title}</h3>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{statLabel}</p>
          <p className="truncate text-xs font-semibold">{statValue}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
