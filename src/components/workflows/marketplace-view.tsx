"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { Search, List, LayoutGrid, Star, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WorkflowIcon } from "./workflow-icon";
import { toast } from "sonner";
import type { Workflow } from "@/types";

const CATEGORY_FILTERS = ["All Workflows", "Popular", "Compliance", "Safety", "Operations", "Customer Experience"];

export function MarketplaceView({ workflows }: { workflows: Workflow[] }) {
  const [category, setCategory] = useState("All Workflows");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"list" | "grid">("list");
  const [installed, setInstalled] = useState(
    () => new Set(workflows.filter((w) => w.installed).map((w) => w.id))
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return workflows.filter((w) => {
      if (category !== "All Workflows" && w.category !== category) return false;
      if (q && !`${w.name} ${w.description}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [workflows, category, query]);

  function handleInstall(w: Workflow) {
    setInstalled((prev) => new Set(prev).add(w.id));
    toast.success(`Installed "${w.name}"- mock action.`);
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="space-y-3 border-b border-border p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1">
            {CATEGORY_FILTERS.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={
                  c === category
                    ? "rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground"
                    : "rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-accent"
                }
              >
                {c}
              </button>
            ))}
          </div>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            mock catalog
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search marketplace..."
              className="h-8 pl-8 text-sm"
            />
          </div>
          <div className="flex items-center gap-0.5 rounded-md border border-border p-0.5">
            <Button
              variant={view === "list" ? "default" : "ghost"}
              size="icon-sm"
              aria-label="List view"
              onClick={() => setView("list")}
            >
              <List className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={view === "grid" ? "default" : "ghost"}
              size="icon-sm"
              aria-label="Grid view"
              onClick={() => setView("grid")}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {view === "list" ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Suitable for</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Alert type(s)</TableHead>
                <TableHead>Installed</TableHead>
                <TableHead>Installed by users</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((w) => {
                const isInstalled = installed.has(w.id);
                return (
                  <TableRow key={w.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <WorkflowIcon name={w.icon} className="h-3.5 w-3.5" />
                        </span>
                        <div>
                          <p className="text-sm font-medium">{w.name}</p>
                          <p className="text-xs text-muted-foreground">{w.category}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex max-w-40 flex-wrap gap-1">
                        {w.suitableFor.slice(0, 2).map((s) => (
                          <span key={s} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                            {s}
                          </span>
                        ))}
                        {w.suitableFor.length > 2 && (
                          <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                            +{w.suitableFor.length - 2}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="w-64 max-w-64 whitespace-normal text-xs text-muted-foreground">
                      {w.description}
                    </TableCell>
                    <TableCell className="w-40 max-w-40 whitespace-normal text-xs text-muted-foreground">
                      {w.alertTypes.join(", ")}
                    </TableCell>
                    <TableCell>
                      {isInstalled ? (
                        <Check className="h-4 w-4 text-success" />
                      ) : (
                        <X className="h-4 w-4 text-critical" />
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {(w.usersCount / 1000).toFixed(1)}K
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-xs">
                        <Star className="h-3 w-3 fill-warning text-warning" />
                        {w.rating.toFixed(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant={isInstalled ? "outline" : "default"}
                        disabled={isInstalled}
                        onClick={() => handleInstall(w)}
                      >
                        {isInstalled ? "Installed" : "Install"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((w) => {
            const isInstalled = installed.has(w.id);
            return (
              <div key={w.id} className="flex flex-col rounded-lg border border-border p-4">
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <WorkflowIcon name={w.icon} className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{w.name}</p>
                      <p className="text-xs text-muted-foreground">{w.category}</p>
                    </div>
                  </div>
                  {isInstalled ? (
                    <Check className="h-4 w-4 shrink-0 text-success" />
                  ) : (
                    <X className="h-4 w-4 shrink-0 text-critical" />
                  )}
                </div>
                <p className="mb-3 flex-1 text-xs text-muted-foreground">{w.description}</p>
                <div className="mb-3 flex flex-wrap gap-1">
                  {w.suitableFor.map((s) => (
                    <span key={s} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      {s}
                    </span>
                  ))}
                </div>
                <p className="mb-3 text-xs text-muted-foreground">{w.alertTypes.join(", ")}</p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-warning text-warning" />
                      {w.rating.toFixed(1)}
                    </span>
                    {(w.usersCount / 1000).toFixed(1)}K users
                  </span>
                  <Button
                    size="sm"
                    variant={isInstalled ? "outline" : "default"}
                    disabled={isInstalled}
                    onClick={() => handleInstall(w)}
                  >
                    {isInstalled ? "Installed" : "Install"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
