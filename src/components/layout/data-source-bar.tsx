export function DataSourceBar() {
  return (
    <div className="border-b border-border bg-muted/30 px-4 py-1.5 text-xs text-muted-foreground md:px-6">
      Live metrics from API · 1 alert from DB + 14 mock rows from{" "}
      <code className="rounded bg-info/10 px-1 py-0.5 font-mono text-info">
        mockData.js
      </code>{" "}
      · charts &amp; marketplace are mock
    </div>
  );
}
