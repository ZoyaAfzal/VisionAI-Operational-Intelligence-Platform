import { AlertsTable } from "@/components/alerts/alerts-table";
import { alerts, locations, cameras } from "@/data/mockData";

export default function AlertsPage() {
  return (
    <div className="p-6">
      <AlertsTable alerts={alerts} locations={locations} cameras={cameras} variant="full" />
    </div>
  );
}
