export function MockDisclaimer({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
      {children}
    </div>
  );
}
