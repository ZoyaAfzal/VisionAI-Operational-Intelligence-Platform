"use client";

import { Check, ChevronDown, MapPin } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocationFilter } from "@/components/location-filter-provider";
import type { Location } from "@/types";
import { cn } from "@/lib/utils";

export function LocationSwitcher({ locations }: { locations: Location[] }) {
  const { locationId, setLocationId } = useLocationFilter();
  const current =
    locationId === "all"
      ? "All Locations"
      : locations.find((l) => l.id === locationId)?.name ?? "All Locations";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label={`Location filter: ${current}`}
          className="flex shrink-0 items-center gap-2 rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground hover:bg-accent sm:px-3"
        >
          <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="hidden max-w-40 truncate sm:inline">{current}</span>
          <ChevronDown className="hidden h-3.5 w-3.5 shrink-0 text-muted-foreground sm:block" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-80 w-56 overflow-y-auto">
        <DropdownMenuItem onClick={() => setLocationId("all")}>
          <Check className={cn("h-4 w-4", locationId !== "all" && "opacity-0")} />
          All Locations
        </DropdownMenuItem>
        {locations.map((loc) => (
          <DropdownMenuItem key={loc.id} onClick={() => setLocationId(loc.id)}>
            <Check className={cn("h-4 w-4", locationId !== loc.id && "opacity-0")} />
            {loc.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
