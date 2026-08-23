import { SidebarContent } from "./sidebar-content";

export function Sidebar() {
  return (
    <aside className="hidden w-52 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
      <SidebarContent layoutId="sidebar-active-pill-desktop" />
    </aside>
  );
}
