"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Camera as CameraIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { NAV_ITEMS } from "./nav-items";
import { locations, cameras, getLocation } from "@/data/mockData";

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="hidden sm:flex"
        aria-label="Search"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search pages, locations, cameras..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Pages">
            {NAV_ITEMS.map((item) => (
              <CommandItem key={item.href} value={item.label} onSelect={() => go(item.href)}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Locations">
            {locations.map((loc) => (
              <CommandItem
                key={loc.id}
                value={`${loc.name} ${loc.code} ${loc.city}`}
                onSelect={() => go(`/locations/${loc.code}`)}
              >
                <MapPin className="mr-2 h-4 w-4" />
                <span>{loc.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {loc.city} · {loc.code}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Cameras">
            {cameras.slice(0, 50).map((cam) => (
              <CommandItem
                key={cam.id}
                value={`${cam.name} ${cam.code}`}
                onSelect={() => go(`/cameras/monitoring/${cam.id}`)}
              >
                <CameraIcon className="mr-2 h-4 w-4" />
                <span>{cam.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {getLocation(cam.locationId)?.name} · {cam.code}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
