"use client";

import { FileText, Download, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MockDisclaimer } from "@/components/mock-disclaimer";
import { toast } from "sonner";

const REPORT_TEMPLATES = [
  { id: "rpt-1", name: "Weekly Operations Summary", description: "Footfall, queue times, and alert volume across all locations.", schedule: "Weekly · Mondays 8:00 AM" },
  { id: "rpt-2", name: "Compliance Audit Report", description: "Violation history and compliance score breakdown by location.", schedule: "Monthly · 1st of month" },
  { id: "rpt-3", name: "Camera Health Report", description: "Uptime, offline events, and DVR status per camera.", schedule: "Not scheduled" },
  { id: "rpt-4", name: "Alert Response Time", description: "Time-to-assign and time-to-resolve breakdown by severity.", schedule: "Weekly · Fridays 5:00 PM" },
];

export default function ReportsPage() {
  return (
    <div className="space-y-4 p-6">
      <div className="rounded-lg border border-border bg-card">
        <div className="border-b border-border p-4">
          <h2 className="text-base font-semibold">Report Templates</h2>
        </div>
        <ul className="divide-y divide-border">
          {REPORT_TEMPLATES.map((r) => (
            <li key={r.id} className="flex items-center gap-4 p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <FileText className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{r.name}</p>
                <p className="truncate text-xs text-muted-foreground">{r.description}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {r.schedule}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.success(`Generating "${r.name}"- mock action.`)}
              >
                <Download className="mr-1 h-3.5 w-3.5" />
                Generate
              </Button>
            </li>
          ))}
        </ul>
      </div>

      <MockDisclaimer>
        Report generation and scheduling require backend endpoints not yet implemented.
        Templates and schedules shown are mock data.
      </MockDisclaimer>
    </div>
  );
}
