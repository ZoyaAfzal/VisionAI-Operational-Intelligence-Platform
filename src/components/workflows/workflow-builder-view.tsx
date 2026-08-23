"use client";

import * as React from "react";
import { useState } from "react";
import { ChevronDown, CircleCheck, Zap } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const EXAMPLE_PROMPTS = [
  "Alert when queue exceeds 8 people for 2 minutes",
  "Alert when a table stays empty and uncleaned for...",
  "Alert if floor is cleaned and no wet floor sign ...",
];

const STEPS = [
  {
    title: "Event Detection",
    description: "Detect cleaning activity on floor",
    icon: Zap,
    color: "text-primary bg-primary/10 border-l-primary",
  },
  {
    title: "Time Condition",
    description: "Wait for 15 seconds",
    icon: Zap,
    color: "text-info bg-info/10 border-l-info",
  },
  {
    title: "Object Detection",
    description: "Check for wet floor sign",
    icon: Zap,
    color: "text-warning bg-warning/10 border-l-warning",
  },
  {
    title: "Trigger Alert",
    description: "Alert if no sign detected",
    icon: Zap,
    color: "text-critical bg-critical/10 border-l-critical",
  },
];

export function WorkflowBuilderView() {
  const [prompt, setPrompt] = useState(
    "Alert if floor is cleaned and no wet floor sign appears within 15 seconds"
  );
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="max-w-3xl rounded-lg border border-border bg-card p-5">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
          1
        </span>
        <h2 className="text-sm font-semibold">Describe what you want to detect</h2>
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {EXAMPLE_PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => setPrompt(p)}
            className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground hover:bg-accent"
          >
            {p}
          </button>
        ))}
      </div>

      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value.slice(0, 500))}
        rows={3}
        className="text-sm"
      />
      <p className="mb-6 mt-1.5 text-right text-xs text-muted-foreground">
        {prompt.length} / 500- mock UI (LLM not connected)
      </p>

      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
            2
          </span>
          <h2 className="text-sm font-semibold">Generated Workflow Preview</h2>
        </div>
        <button
          className="text-xs text-primary hover:underline"
          onClick={() => toast.info("Regenerating preview- mock UI, LLM not connected.")}
        >
          Regenerate
        </button>
      </div>

      <div className="space-y-2">
        {STEPS.map((step) => (
          <div
            key={step.title}
            className={cn("flex items-center justify-between rounded-md border-l-4 bg-muted/40 p-3", step.color)}
          >
            <div className="flex items-center gap-3">
              <step.icon className="h-4 w-4" />
              <div>
                <p className="text-sm font-medium text-foreground">{step.title}</p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-success">
              <CircleCheck className="h-3.5 w-3.5" />
              Ready
            </span>
          </div>
        ))}
      </div>

      <button
        className="mt-3 flex w-full items-center justify-between rounded-md border border-border px-3 py-2 text-xs text-muted-foreground hover:bg-accent"
        onClick={() => setShowAdvanced((s) => !s)}
      >
        Advanced settings
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", showAdvanced && "rotate-180")} />
      </button>
      {showAdvanced && (
        <div className="mt-2 rounded-md border border-dashed border-border p-3 text-xs text-muted-foreground">
          Sensitivity, cooldown period, and notification routing settings would appear here
          once connected to a real detection backend.
        </div>
      )}

      <p className="mt-4 text-xs text-muted-foreground">LLM not connected- preview is illustrative.</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="outline" disabled>
          Test Workflow
        </Button>
        <Button onClick={() => toast.success("Workflow saved- mock action.")}>Save Workflow</Button>
        <Button
          variant="outline"
          onClick={() => toast.success("Workflow saved and applied to locations- mock action.")}
        >
          Save &amp; Apply to locations
        </Button>
      </div>
    </div>
  );
}
