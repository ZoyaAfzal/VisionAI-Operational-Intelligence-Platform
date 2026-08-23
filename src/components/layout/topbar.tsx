import { Search } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "./theme-toggle";
import { LocationSwitcher } from "./location-switcher";
import { NotificationsMenu } from "./notifications-menu";
import { UserMenu } from "./user-menu";
import { MobileNav } from "./mobile-nav";
import { locations, alerts, getLocation } from "@/data/mockData";

export function Topbar() {
  const locationsById = new Map(locations.map((l) => [l.id, getLocation(l.id)!]));

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-3 sm:gap-3 sm:px-4 md:px-6">
      <div className="shrink-0">
        <MobileNav />
      </div>
      <Logo className="md:hidden" />
      <h1 className="hidden truncate text-sm font-semibold text-foreground md:block">
        VisionAI - Operational Intelligence Platform
      </h1>

      <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1.5 [&>*]:shrink-0">
        <button
          className="hidden items-center gap-2 rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground sm:flex"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </button>
        <ThemeToggle />
        <NotificationsMenu alerts={alerts} locationsById={locationsById} />
        <LocationSwitcher locations={locations} />
        <UserMenu />
      </div>
    </header>
  );
}
