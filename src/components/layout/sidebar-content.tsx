import { Smartphone } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { SidebarNav } from "./sidebar-nav";
import { activeAlertCount } from "@/data/mockData";

/**
 * Shared logo + nav + footer-cards content, rendered by both the desktop
 * `<aside>` sidebar and the mobile Sheet drawer- one source of truth for
 * the nav so they can't drift out of sync.
 */
export function SidebarContent({
  onNavigate,
  layoutId,
}: {
  onNavigate?: () => void;
  layoutId?: string;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
        <Logo onClick={onNavigate} />
      </div>

      <SidebarNav
        activeAlertCount={activeAlertCount}
        onNavigate={onNavigate}
        {...(layoutId ? { layoutId } : {})}
      />

      <div className="space-y-2 border-t border-sidebar-border p-3">
        <div className="flex items-center gap-2 rounded-lg border border-sidebar-border bg-card/50 p-3">
          <span className="h-2 w-2 shrink-0 rounded-full bg-success" />
          <div className="min-w-0">
            <p className="truncate text-xs font-medium">System Status</p>
            <p className="truncate text-[11px] text-muted-foreground">
              All systems operational
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-sidebar-border bg-card/50 p-3">
          <div className="mb-2 flex items-center gap-2">
            <Smartphone className="h-3.5 w-3.5 text-muted-foreground" />
            <div className="min-w-0">
              <p className="truncate text-xs font-medium">VisionAI Mobile</p>
              <p className="truncate text-[11px] text-muted-foreground">
                Monitor on the go
              </p>
            </div>
          </div>
          <div className="flex gap-1.5">
            <span className="flex-1 rounded-md border border-sidebar-border px-1.5 py-1 text-center text-[10px] text-muted-foreground">
              App Store
            </span>
            <span className="flex-1 rounded-md border border-sidebar-border px-1.5 py-1 text-center text-[10px] text-muted-foreground">
              Google Play
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
