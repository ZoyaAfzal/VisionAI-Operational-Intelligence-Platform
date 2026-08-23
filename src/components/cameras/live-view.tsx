"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { CameraOff } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CameraFeedCard } from "./camera-feed-card";
import { InactiveCameraCard } from "./inactive-camera-card";
import { useLocationFilter } from "@/components/location-filter-provider";
import type { Camera, Location } from "@/types";

export function LiveView({ cameras, locations }: { cameras: Camera[]; locations: Location[] }) {
  const { locationId: globalLocationId } = useLocationFilter();
  const [locationId, setLocationId] = useState(
    globalLocationId !== "all" ? globalLocationId : ""
  );

  const location = locations.find((l) => l.id === locationId);
  const locationCameras = useMemo(
    () => cameras.filter((c) => c.locationId === locationId),
    [cameras, locationId]
  );
  const active = locationCameras.filter((c) => c.status === "Active");
  const inactive = locationCameras.filter((c) => c.status !== "Active");

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
        <h2 className="text-base font-semibold">Live Feeds</h2>
        <Select value={locationId} onValueChange={setLocationId}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Select a location..." />
          </SelectTrigger>
          <SelectContent>
            {locations.map((loc) => (
              <SelectItem key={loc.id} value={loc.id}>
                {loc.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!location ? (
        <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
          <CameraOff className="h-9 w-9 text-muted-foreground" />
          <p className="text-base font-medium">Select a location to view live feeds</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Choose a location from the dropdown above. Active and inactive cameras at that
            site will be shown.
          </p>
        </div>
      ) : (
        <div className="space-y-6 p-4">
          <div>
            <p className="mb-3 text-sm text-muted-foreground">
              {active.length} active cameras · {location.name}
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {active.map((cam) => (
                <CameraFeedCard key={cam.id} camera={cam} location={location} variant="live" />
              ))}
            </div>
          </div>

          {inactive.length > 0 && (
            <div>
              <p className="mb-3 text-sm text-muted-foreground">
                {inactive.length} inactive cameras · no live feed
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {inactive.map((cam) => (
                  <InactiveCameraCard key={cam.id} camera={cam} location={location} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
