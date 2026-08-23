import { PillTabs } from "@/components/layout/pill-tabs";

export default function CamerasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight">Cameras</h1>
        <PillTabs
          layoutId="cameras-tab-pill"
          tabs={[
            { href: "/cameras", label: "Inventory", exact: true },
            { href: "/cameras/live", label: "Live" },
            { href: "/cameras/monitoring", label: "Monitoring", disabled: true },
          ]}
        />
      </div>
      {children}
    </div>
  );
}
