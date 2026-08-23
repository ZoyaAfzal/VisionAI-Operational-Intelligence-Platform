import { PillTabs } from "@/components/layout/pill-tabs";

export default function AiWorkflowsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight">AI Workflows</h1>
        <PillTabs
          layoutId="workflows-tab-pill"
          tabs={[
            { href: "/ai-workflows", label: "My Workflows", exact: true },
            { href: "/ai-workflows/marketplace", label: "Marketplace" },
            { href: "/ai-workflows/workflow-builder", label: "Workflow Builder" },
          ]}
        />
      </div>
      {children}
    </div>
  );
}
