"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

function SettingsRow({
  title,
  description,
  defaultChecked,
}: {
  title: string;
  description: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}

export default function SettingsPage() {
  function save() {
    toast.success("Settings saved- mock action.");
  }

  return (
    <div className="p-6">
      <Tabs defaultValue="account" className="max-w-2xl">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="organization">Organization</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-4 rounded-lg border border-border bg-card p-5">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" defaultValue="Demo User" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="demo.user@visionai.example" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="role">Role</Label>
            <Input id="role" defaultValue="Admin" disabled />
          </div>
          <Button onClick={save}>Save changes</Button>
        </TabsContent>

        <TabsContent value="notifications" className="rounded-lg border border-border bg-card p-5">
          <div className="divide-y divide-border">
            <SettingsRow
              title="Critical alerts"
              description="Email and push notifications for Critical severity alerts."
              defaultChecked
            />
            <SettingsRow
              title="Warning alerts"
              description="Notifications for Warning severity alerts."
              defaultChecked
            />
            <SettingsRow
              title="Daily digest"
              description="Summary email of the previous day's activity."
              defaultChecked
            />
            <SettingsRow
              title="Weekly report"
              description="Scheduled report emailed every Monday."
            />
          </div>
          <Separator className="my-4" />
          <Button onClick={save}>Save preferences</Button>
        </TabsContent>

        <TabsContent value="organization" className="space-y-4 rounded-lg border border-border bg-card p-5">
          <div className="space-y-1.5">
            <Label htmlFor="org-name">Organization name</Label>
            <Input id="org-name" defaultValue="VisionAI Demo Org" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="timezone">Default timezone</Label>
            <Input id="timezone" defaultValue="America/Chicago" />
          </div>
          <SettingsRow
            title="Require 2FA for admins"
            description="Enforce two-factor authentication for admin accounts."
            defaultChecked
          />
          <Button onClick={save}>Save organization settings</Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
