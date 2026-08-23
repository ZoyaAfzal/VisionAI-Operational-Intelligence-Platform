"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { List, LayoutGrid, Search, Plus, ExternalLink } from "lucide-react";
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
import { CameraFeedCard } from "./camera-feed-card";
import { useLocationFilter } from "@/components/location-filter-provider";
import { cn } from "@/lib/utils";
import type { Camera, CameraStatus, Location } from "@/types";

const STATUS_DOT: Record<CameraStatus, string> = {
  Active: "bg-success",
  Inactive: "bg-warning",
  Disabled: "bg-muted-foreground",
};

export function InventoryView({
  cameras,
  locations,
}: {
  cameras: Camera[];
  locations: Location[];
}) {
  const { locationId } = useLocationFilter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<CameraStatus | "all">("all");
  const [view, setView] = useState<"list" | "grid">("list");

  const locationsById = useMemo(() => new Map(locations.map((l) => [l.id, l])), [locations]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cameras.filter((c) => {
      if (locationId !== "all" && c.locationId !== locationId) return false;
      if (status !== "all" && c.status !== status) return false;
      if (q) {
        const loc = locationsById.get(c.locationId);
        const haystack = `${c.id} ${c.name} ${c.brand} ${loc?.name ?? ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [cameras, locationId, status, query, locationsById]);

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
        <h2 className="text-base font-semibold">Camera Inventory</h2>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search id, name, brand..."
              className="h-8 w-56 pl-8 text-sm"
            />
          </div>
          <Select value={status} onValueChange={(v) => setStatus(v as CameraStatus | "all")}>
            <SelectTrigger size="sm" className="w-32">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Disabled">Disabled</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" onClick={() => {}}>
            <Plus className="mr-1 h-3.5 w-3.5" /> Add Camera
          </Button>
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
                <TableHead>Status</TableHead>
                <TableHead>Camera</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>City</TableHead>
                <TableHead>DVR Code</TableHead>
                <TableHead>DVR Brand</TableHead>
                <TableHead className="w-16 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((cam) => {
                const location = locationsById.get(cam.locationId);
                return (
                  <TableRow key={cam.id}>
                    <TableCell>
                      <span className="flex items-center gap-1.5 text-xs font-medium">
                        <span className={cn("h-2 w-2 rounded-full", STATUS_DOT[cam.status])} />
                        {cam.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium">{cam.name}</p>
                      <p className="font-mono text-[11px] text-muted-foreground">{cam.code}</p>
                    </TableCell>
                    <TableCell className="text-sm">{cam.brand}</TableCell>
                    <TableCell className="text-sm">{location?.name}</TableCell>
                    <TableCell className="text-sm">{location?.city}</TableCell>
                    <TableCell className="text-sm">{cam.dvrCode}</TableCell>
                    <TableCell className="text-sm">{cam.dvrBrand}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon-sm" asChild aria-label="Open monitoring view">
                        <Link href={`/cameras/monitoring/${cam.id}`}>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((cam) => {
            const location = locationsById.get(cam.locationId);
            if (!location) return null;
            return (
              <CameraFeedCard key={cam.id} camera={cam} location={location} variant="inventory" />
            );
          })}
        </div>
      )}

      <div className="border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
        Showing {filtered.length} of {cameras.length} cameras
      </div>
    </div>
  );
}
