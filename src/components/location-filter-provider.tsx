"use client";

import * as React from "react";

type LocationFilterContextValue = {
  /** Selected location id, or "all" for every location. */
  locationId: string;
  setLocationId: (id: string) => void;
};

const LocationFilterContext = React.createContext<LocationFilterContextValue | null>(
  null
);

export function LocationFilterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locationId, setLocationId] = React.useState("all");

  const value = React.useMemo(
    () => ({ locationId, setLocationId }),
    [locationId]
  );

  return (
    <LocationFilterContext.Provider value={value}>
      {children}
    </LocationFilterContext.Provider>
  );
}

export function useLocationFilter() {
  const ctx = React.useContext(LocationFilterContext);
  if (!ctx) {
    throw new Error(
      "useLocationFilter must be used within a LocationFilterProvider"
    );
  }
  return ctx;
}
