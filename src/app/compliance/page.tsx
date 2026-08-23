import { LineChart } from "@/components/charts/line-chart";
import { SeverityBadge } from "@/components/alerts/severity-badge";
import { MockDisclaimer } from "@/components/mock-disclaimer";
import { locations, complianceViolations, alerts, overviewKpis, getLocation } from "@/data/mockData";

const COMPLIANCE_ALERT_TYPES = new Set([
  "Dirty Table Detected",
  "Compliance Violation",
  "Temperature Compliance Violation",
  "Safety Violation",
  "Slip Hazard",
]);

export default function CompliancePage() {
  const violations = alerts
    .filter((a) => COMPLIANCE_ALERT_TYPES.has(a.type))
    .slice(0, 10);

  return (
    <div className="space-y-4 p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Overall Compliance Score</p>
          <p className="mt-1 text-3xl font-bold">{overviewKpis.complianceScore.value}</p>
          <p className="mt-1 text-xs text-success">{overviewKpis.complianceScore.change} vs last period</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Open Compliance Alerts</p>
          <p className="mt-1 text-3xl font-bold text-critical">
            {violations.filter((v) => v.status !== "Resolved").length}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Locations Below 85%</p>
          <p className="mt-1 text-3xl font-bold">{locations.filter((l) => l.health < 85).length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-3 text-sm font-semibold">Violations by Day</h2>
          <LineChart data={complianceViolations} color="critical" unit=" violations" />
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-3 text-sm font-semibold">Compliance Score by Location</h2>
          <ul className="space-y-2">
            {locations.map((loc) => (
              <li key={loc.id} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{loc.name}</span>
                <span className="font-medium">{loc.health}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <div className="border-b border-border p-4">
          <h2 className="text-base font-semibold">Violation History</h2>
        </div>
        <ul className="divide-y divide-border">
          {violations.map((v) => (
            <li key={v.id} className="flex items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{v.type}</p>
                <p className="text-xs text-muted-foreground">
                  {getLocation(v.locationId)?.name} · {v.time}
                </p>
              </div>
              <SeverityBadge severity={v.severity} />
            </li>
          ))}
        </ul>
      </div>

      <MockDisclaimer>
        Compliance score and violation history are derived from{" "}
        <code className="rounded bg-info/10 px-1 py-0.5 font-mono text-info">
          src/data/mockData.js
        </code>
        . Wire a real compliance-scoring endpoint to replace this view.
      </MockDisclaimer>
    </div>
  );
}
