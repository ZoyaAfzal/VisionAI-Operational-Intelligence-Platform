"use client";

import * as React from "react";
import { useState } from "react";
import { Camera, Hash, Mail, Webhook, MessageSquare } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { MockDisclaimer } from "@/components/mock-disclaimer";
import { toast } from "sonner";

const DVR_VENDORS = [
  { name: "Hikvision NVR", connected: true },
  { name: "Axis Companion", connected: true },
  { name: "Dahua Lite", connected: true },
  { name: "Milestone XProtect", connected: true },
  { name: "Bosch DIVAR", connected: false },
  { name: "Uniview NVR", connected: false },
];

const THIRD_PARTY = [
  { name: "Slack", description: "Send critical alerts to a Slack channel.", icon: Hash },
  { name: "Email Digest", description: "Daily summary emailed to managers.", icon: Mail },
  { name: "Webhook", description: "POST alert events to a custom endpoint.", icon: Webhook },
  { name: "SMS Alerts", description: "Text critical alerts to on-call staff.", icon: MessageSquare },
];

export default function IntegrationsPage() {
  const [dvrConnected, setDvrConnected] = useState(
    () => new Map(DVR_VENDORS.map((v) => [v.name, v.connected]))
  );
  const [thirdPartyConnected, setThirdPartyConnected] = useState(
    () => new Map<string, boolean>([["Slack", true]])
  );

  return (
    <div className="space-y-4 p-6">
      <div className="rounded-lg border border-border bg-card">
        <div className="border-b border-border p-4">
          <h2 className="text-base font-semibold">DVR / NVR Systems</h2>
          <p className="text-xs text-muted-foreground">
            Camera feeds are ingested through these video management systems.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
          {DVR_VENDORS.map((v) => {
            const connected = dvrConnected.get(v.name) ?? false;
            return (
              <div key={v.name} className="flex items-center gap-3 rounded-lg border border-border p-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Camera className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{v.name}</p>
                  <p className={connected ? "text-xs text-success" : "text-xs text-muted-foreground"}>
                    {connected ? "Connected" : "Not connected"}
                  </p>
                </div>
                <Switch
                  checked={connected}
                  onCheckedChange={(checked) => {
                    setDvrConnected((prev) => new Map(prev).set(v.name, checked));
                    toast.success(`${v.name} ${checked ? "connected" : "disconnected"}- mock action.`);
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <div className="border-b border-border p-4">
          <h2 className="text-base font-semibold">Third-Party Integrations</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
          {THIRD_PARTY.map((t) => {
            const connected = thirdPartyConnected.get(t.name) ?? false;
            return (
              <div key={t.name} className="flex items-center gap-3 rounded-lg border border-border p-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <t.icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{t.description}</p>
                </div>
                <Button
                  size="sm"
                  variant={connected ? "outline" : "default"}
                  onClick={() => {
                    setThirdPartyConnected((prev) => new Map(prev).set(t.name, !connected));
                    toast.success(`${t.name} ${!connected ? "connected" : "disconnected"}- mock action.`);
                  }}
                >
                  {connected ? "Disconnect" : "Connect"}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      <MockDisclaimer>
        Integration connections are mock UI- no real DVR/NVR or third-party API calls are
        made yet.
      </MockDisclaimer>
    </div>
  );
}
