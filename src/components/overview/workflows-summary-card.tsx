import Link from "next/link";
import { Workflow } from "lucide-react";

export function WorkflowsSummaryCard({
  enabledCount,
  totalCount,
}: {
  enabledCount: number;
  totalCount: number;
}) {
  return (
    <div className="flex h-full flex-col rounded-lg border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-semibold">
          <Workflow className="h-4 w-4 text-primary" />
          AI Workflows
        </h2>
        <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">
          {enabledCount}/{totalCount} enabled
        </span>
      </div>
      <p className="mb-4 flex-1 text-sm text-muted-foreground">
        Pre-built and custom detection rules watch your camera feeds and generate alerts.
        Manage your installed workflows, install new templates from the marketplace, or
        build your own with the natural-language Workflow Builder.
      </p>
      <div className="flex flex-col gap-1.5 text-sm">
        <Link href="/ai-workflows" className="font-medium text-primary hover:underline">
          My Workflows →
        </Link>
        <Link href="/ai-workflows/marketplace" className="font-medium text-primary hover:underline">
          Marketplace →
        </Link>
      </div>
    </div>
  );
}
