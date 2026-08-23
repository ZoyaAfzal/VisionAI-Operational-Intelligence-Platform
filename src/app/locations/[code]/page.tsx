import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { TypeBadge } from "@/components/locations/type-badge";
import { LocationStatusBadge } from "@/components/locations/status-badge";
import { SeverityBadge } from "@/components/alerts/severity-badge";
import { StatusText } from "@/components/alerts/status-text";
import { CameraFeedCard } from "@/components/cameras/camera-feed-card";
import {
  locations,
  camerasForLocation,
  alertsForLocation,
  activeAlertCountForLocation,
} from "@/data/mockData";

export default async function LocationDetailPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const location = locations.find((l) => l.code === code);
  if (!location) notFound();

  const cameras = camerasForLocation(location.id);
  const activeCameraCount = cameras.filter((c) => c.status === "Active").length;
  const alerts = alertsForLocation(location.id).slice(0, 6);
  const activeAlerts = activeAlertCountForLocation(location.id);

  return (
    <div className="p-6">
      <Link
        href="/locations"
        className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Locations
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{location.name}</h1>
            <TypeBadge type={location.type} />
          </div>
          <p className="text-sm text-muted-foreground">
            {location.code} · {location.city}, {location.region}
          </p>
        </div>
        <LocationStatusBadge status={location.status} />
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Manager" value={location.manager} />
        <StatCard label="Health Score" value={`${location.health}%`} />
        <StatCard
          label="Active Alerts"
          value={String(activeAlerts)}
          tone={activeAlerts > 0 ? "critical" : undefined}
        />
        <StatCard label="Cameras" value={String(cameras.length)} />
        <StatCard label="Active Cameras" value={String(activeCameraCount)} />
      </div>

      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold">Cameras</h2>
          <Link href="/cameras" className="text-xs text-primary hover:underline">
            View all in Inventory →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cameras.slice(0, 8).map((cam) => (
            <CameraFeedCard key={cam.id} camera={cam} location={location} variant="inventory" />
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <div className="border-b border-border p-4">
          <h2 className="text-base font-semibold">Recent Alerts</h2>
        </div>
        {alerts.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">No alerts for this location.</p>
        ) : (
          <ul className="divide-y divide-border">
            {alerts.map((alert) => (
              <li key={alert.id} className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{alert.type}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
                <div className="flex items-center gap-3">
                  <SeverityBadge severity={alert.severity} />
                  <StatusText status={alert.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "critical";
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-1 text-xl font-semibold ${tone === "critical" ? "text-critical" : ""}`}>
        {value}
      </p>
    </div>
  );
}
