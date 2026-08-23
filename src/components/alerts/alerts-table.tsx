"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { Play, MessageSquare } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SeverityBadge } from "./severity-badge";
import { StatusText } from "./status-text";
import { AlertClipModal } from "./alert-clip-modal";
import { useLocationFilter } from "@/components/location-filter-provider";
import { toast } from "sonner";
import type { Alert, AlertSeverity, Camera, Location } from "@/types";

export function AlertsTable({
  alerts,
  locations,
  cameras,
  variant = "full",
}: {
  alerts: Alert[];
  locations: Location[];
  cameras: Camera[];
  variant?: "full" | "compact";
}) {
  const { locationId } = useLocationFilter();
  const [severity, setSeverity] = useState<AlertSeverity | "all">("all");
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const locationsById = useMemo(() => new Map(locations.map((l) => [l.id, l])), [locations]);
  const camerasById = useMemo(() => new Map(cameras.map((c) => [c.id, c])), [cameras]);

  const filtered = useMemo(() => {
    return alerts.filter((a) => {
      if (locationId !== "all" && a.locationId !== locationId) return false;
      if (severity !== "all" && a.severity !== severity) return false;
      return true;
    });
  }, [alerts, locationId, severity]);

  const rows = variant === "compact" ? filtered.slice(0, 6) : filtered;
  const activeCount = alerts.filter((a) => a.status !== "Resolved").length;

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold">Alert Management</h2>
          <span className="rounded-full bg-critical/15 px-2 py-0.5 text-xs font-medium text-critical">
            {activeCount} Active Alerts
          </span>
        </div>

        {variant === "full" && (
          <div className="flex flex-wrap items-center gap-2">
            <Select value={severity} onValueChange={(v) => setSeverity(v as AlertSeverity | "all")}>
              <SelectTrigger size="sm" className="w-36">
                <SelectValue placeholder="All Severities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="Warning">Warning</SelectItem>
                <SelectItem value="Info">Info</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger size="sm" className="w-32">
                <SelectValue placeholder="All dates" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All dates</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Alert Type</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Camera</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((alert) => {
              const location = locationsById.get(alert.locationId);
              const camera = camerasById.get(alert.cameraId);
              const hasClip = alert.clipVariant !== "none";

              return (
                <TableRow key={alert.id}>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {alert.time}
                  </TableCell>
                  <TableCell className="text-sm">{location?.name}</TableCell>
                  <TableCell className="text-sm">{alert.type}</TableCell>
                  <TableCell>
                    <SeverityBadge severity={alert.severity} />
                  </TableCell>
                  <TableCell>
                    <StatusText status={alert.status} />
                  </TableCell>
                  <TableCell className="text-sm">{camera?.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!hasClip}
                        onClick={() => setSelectedAlert(alert)}
                      >
                        <Play className="mr-1 h-3 w-3" /> View Video
                      </Button>
                      {variant === "full" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Comment"
                            onClick={() => toast.info("Comments require a backend endpoint not yet implemented.")}
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            className="bg-info text-info-foreground hover:bg-info/90"
                            onClick={() => toast.success(`Assigned "${alert.type}"- mock action.`)}
                          >
                            Assign
                          </Button>
                          <Button
                            size="sm"
                            className="bg-success text-success-foreground hover:bg-success/90"
                            onClick={() => toast.success(`Resolved "${alert.type}"- mock action.`)}
                          >
                            Resolve
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
        Showing {rows.length} alert{rows.length === 1 ? "" : "s"} · newest first
      </div>

      {variant === "full" && (
        <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
          Alert actions (View Video, Assign, Resolve) require backend endpoints not yet
          implemented. Location, severity, and camera columns use mock enrichment from{" "}
          <code className="rounded bg-info/10 px-1 py-0.5 font-mono text-info">
            src/data/mockData.js
          </code>
          .
        </div>
      )}

      {selectedAlert && camerasById.get(selectedAlert.cameraId) && locationsById.get(selectedAlert.locationId) && (
        <AlertClipModal
          alert={selectedAlert}
          camera={camerasById.get(selectedAlert.cameraId)!}
          location={locationsById.get(selectedAlert.locationId)!}
          open={Boolean(selectedAlert)}
          onOpenChange={(open) => !open && setSelectedAlert(null)}
        />
      )}
    </div>
  );
}
