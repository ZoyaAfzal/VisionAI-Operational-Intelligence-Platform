"use client";

import { Download, TriangleAlert, Users, Clock, UserX, Gauge, ListOrdered, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CameraStill } from "@/components/cameras/camera-still";
import type { Alert, Camera, Location } from "@/types";

export function AlertClipModal({
  alert,
  camera,
  location,
  open,
  onOpenChange,
}: {
  alert: Alert;
  camera: Camera;
  location: Location;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="max-w-3xl p-0">
        <DialogHeader className="flex-row items-start justify-between space-y-0 border-b border-border px-5 py-4">
          <div>
            <DialogTitle className="text-base">
              Alert Clip- {alert.type}
            </DialogTitle>
            <DialogDescription>
              {location.name} · {camera.name} · {alert.clipDescription}
            </DialogDescription>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" aria-label="Download clip">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Close" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="relative aspect-video overflow-hidden bg-black">
          <CameraStill src={camera.image} alt={`${alert.type} clip`} />

          <div className="mono-overlay absolute left-3 top-3 rounded bg-black/60 px-2 py-1 text-[11px] text-white">
            {alert.time}
            <br />
            {camera.code}
          </div>

          {alert.clipVariant === "queue-abandonment" && (
            <QueueAbandonmentOverlay />
          )}
          {alert.clipVariant === "dirty-table" && <DirtyTableOverlay />}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function QueueAbandonmentOverlay() {
  const boxes = [
    { id: "Customer-01", left: 66, top: 22, width: 10, height: 34, time: "6m12s" },
    { id: "Customer-02", left: 55, top: 24, width: 9, height: 32, time: "5m03s" },
    { id: "Customer-04", left: 44, top: 26, width: 9, height: 32, time: "2m11s" },
    { id: "Customer-03", left: 32, top: 28, width: 9, height: 33, time: "1m43s" },
    { id: "Customer-05", left: 13, top: 32, width: 9, height: 34, time: "3m46s" },
  ];

  return (
    <>
      <div className="absolute left-1/2 top-3 w-64 -translate-x-1/2 rounded bg-critical/90 p-2 text-white shadow-lg">
        <p className="flex items-center gap-1 text-xs font-bold">
          <TriangleAlert className="h-3.5 w-3.5" /> QUEUE ABANDONED
        </p>
        <dl className="mono-overlay mt-1 space-y-0.5 text-[10px] text-white/90">
          <div className="flex justify-between gap-2">
            <dt>waited-before-abandoning:</dt>
            <dd>3m46s</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt>queue-position-at-exit:</dt>
            <dd>3</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt>event-type:</dt>
            <dd>queue-abandonment</dd>
          </div>
        </dl>
      </div>

      <div className="glass-panel absolute right-3 top-3 w-48 rounded-md p-3 text-white shadow-lg">
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-info">
          Real-Time Queue Analytics
        </p>
        <dl className="space-y-1 text-xs">
          <StatRow icon={Users} label="Queue Length" value="4" />
          <StatRow icon={ListOrdered} label="Customers Tracked" value="5" />
          <StatRow icon={UserX} label="Abandonments Today" value="1" />
          <StatRow icon={Clock} label="Average Wait Time" value="3m39s" mono />
          <StatRow icon={Gauge} label="Abandonment Rate" value="20%" />
        </dl>
      </div>

      {boxes.map((b) => (
        <div key={b.id}>
          <div
            className="absolute rounded-sm border-2 border-warning"
            style={{ left: `${b.left}%`, top: `${b.top}%`, width: `${b.width}%`, height: `${b.height}%` }}
          />
          <div
            className="mono-overlay absolute rounded bg-warning/90 px-1 py-0.5 text-[9px] font-semibold text-warning-foreground"
            style={{ left: `${b.left}%`, top: `calc(${b.top}% - 26px)` }}
          >
            ID: {b.id}
            <br />
            in-queue-time: {b.time}
          </div>
        </div>
      ))}

      <div className="absolute bottom-3 left-3 w-40 space-y-1 rounded bg-black/60 p-2 text-[9px] text-white/80">
        <LegendRow color="bg-warning" label="Queue Zone Boundary" />
        <LegendRow color="bg-info" label="Entry Detection Line" />
        <LegendRow color="bg-success" label="Exit Detection Line" />
        <LegendRow color="bg-critical" label="Queue Abandonment Event" />
      </div>
    </>
  );
}

function DirtyTableOverlay() {
  return (
    <>
      <div
        className="absolute rounded-sm border-2 border-warning"
        style={{ left: "38%", top: "42%", width: "26%", height: "34%" }}
      />
      <div
        className="rounded bg-warning/90 px-2 py-1 text-[11px] font-semibold text-warning-foreground shadow"
        style={{ position: "absolute", left: "38%", top: "calc(42% - 30px)" }}
      >
        table-dirty-unattended for 5m36s
      </div>
    </>
  );
}

function StatRow({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="flex items-center gap-1 text-white/60">
        <Icon className="h-3 w-3" />
        {label}
      </dt>
      <dd className={mono ? "mono-overlay font-semibold" : "font-semibold"}>{value}</dd>
    </div>
  );
}

function LegendRow({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-1.5 w-3 shrink-0 rounded-sm ${color}`} />
      {label}
    </div>
  );
}
