"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TypeBadge } from "./type-badge";
import { LocationStatusBadge } from "./status-badge";
import { toast } from "sonner";
import type { Location, LocationStatus, LocationType } from "@/types";

export function LocationsView({
  locations,
  alertCounts,
}: {
  locations: Location[];
  alertCounts: Map<string, number>;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<LocationType | "all">("all");
  const [status, setStatus] = useState<LocationStatus | "all">("all");

  const types = useMemo(
    () => Array.from(new Set(locations.map((l) => l.type))).sort(),
    [locations]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return locations.filter((l) => {
      if (type !== "all" && l.type !== type) return false;
      if (status !== "all" && l.status !== status) return false;
      if (q && !`${l.code} ${l.name} ${l.city}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [locations, query, type, status]);

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
        <h2 className="text-base font-semibold">Locations</h2>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search code, name, city..."
              className="h-8 w-56 pl-8 text-sm"
            />
          </div>
          <Select value={type} onValueChange={(v) => setType(v as LocationType | "all")}>
            <SelectTrigger size="sm" className="w-32">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {types.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(v) => setStatus(v as LocationStatus | "all")}>
            <SelectTrigger size="sm" className="w-32">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" onClick={() => toast.info("Adding locations requires a backend endpoint not yet implemented.")}>
            <Plus className="mr-1 h-3.5 w-3.5" /> Add Location
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead className="text-right">Alerts</TableHead>
              <TableHead className="text-right">Health</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((loc) => {
              const alertCount = alertCounts.get(loc.id) ?? 0;
              return (
                <TableRow
                  key={loc.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/locations/${loc.code}`)}
                >
                  <TableCell className="font-mono text-xs text-info">{loc.code}</TableCell>
                  <TableCell className="text-sm font-medium">{loc.name}</TableCell>
                  <TableCell>
                    <TypeBadge type={loc.type} />
                  </TableCell>
                  <TableCell className="text-sm">{loc.city}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{loc.region}</TableCell>
                  <TableCell>
                    <LocationStatusBadge status={loc.status} />
                  </TableCell>
                  <TableCell className="text-sm">{loc.manager}</TableCell>
                  <TableCell
                    className={`text-right text-sm font-medium ${alertCount > 0 ? "text-critical" : "text-muted-foreground"}`}
                  >
                    {alertCount}
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium">{loc.health}%</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
        Showing {filtered.length} of {locations.length} locations · click a row for details
      </div>
    </div>
  );
}
