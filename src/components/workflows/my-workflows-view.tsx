"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { WorkflowIcon } from "./workflow-icon";
import { toast } from "sonner";
import type { Workflow } from "@/types";

export function MyWorkflowsView({ workflows }: { workflows: Workflow[] }) {
  const [enabled, setEnabled] = useState(
    () => new Map(workflows.map((w) => [w.id, w.enabled]))
  );

  const enabledCount = Array.from(enabled.values()).filter(Boolean).length;

  function toggle(w: Workflow) {
    setEnabled((prev) => {
      const next = new Map(prev);
      const value = !next.get(w.id);
      next.set(w.id, value);
      toast.success(`${w.name} ${value ? "enabled" : "disabled"}- mock action.`);
      return next;
    });
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
        <div>
          <h2 className="text-base font-semibold">My Workflows</h2>
          <p className="text-xs text-muted-foreground">
            {enabledCount}/{workflows.length} enabled across your locations
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href="/ai-workflows/marketplace">Browse Marketplace</Link>
        </Button>
      </div>

      <ul className="divide-y divide-border">
        {workflows.map((w) => (
          <li key={w.id} className="flex items-center gap-4 p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <WorkflowIcon name={w.icon} className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{w.name}</p>
              <p className="truncate text-xs text-muted-foreground">{w.description}</p>
            </div>
            <span className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
              <Star className="h-3 w-3 fill-warning text-warning" />
              {w.rating.toFixed(1)}
            </span>
            <Switch checked={enabled.get(w.id) ?? false} onCheckedChange={() => toggle(w)} />
          </li>
        ))}
      </ul>
    </div>
  );
}
