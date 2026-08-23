"use client";

import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LocationFilterProvider } from "@/components/location-filter-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <TooltipProvider delayDuration={200}>
        <LocationFilterProvider>{children}</LocationFilterProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
