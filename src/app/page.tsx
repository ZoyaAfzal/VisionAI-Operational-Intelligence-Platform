import { KpiCard } from "@/components/kpi-card";
import { AlertsTable } from "@/components/alerts/alerts-table";
import { WorkflowsSummaryCard } from "@/components/overview/workflows-summary-card";
import {
  overviewKpis,
  alerts,
  locations,
  cameras,
  installedWorkflows,
  enabledWorkflowCount,
} from "@/data/mockData";

export default function OverviewPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard title="Footfall Today" color="success" {...overviewKpis.footfallToday} />
        <KpiCard title="Active Alerts" color="critical" {...overviewKpis.activeAlerts} />
        <KpiCard title="Compliance Score" color="info" {...overviewKpis.complianceScore} />
        <KpiCard title="Avg. Queue Time" color="primary" {...overviewKpis.avgQueueTime} />
        <KpiCard title="Location Health" color="warning" {...overviewKpis.locationHealth} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AlertsTable alerts={alerts} locations={locations} cameras={cameras} variant="compact" />
        </div>
        <WorkflowsSummaryCard
          enabledCount={enabledWorkflowCount}
          totalCount={installedWorkflows.length}
        />
      </div>
    </div>
  );
}
