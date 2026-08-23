import {
  LayoutGrid,
  Bell,
  Workflow,
  BarChart3,
  MapPin,
  Camera,
  FileText,
  ShieldCheck,
  Plug,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: "alerts";
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Overview", icon: LayoutGrid },
  { href: "/alerts", label: "Alerts", icon: Bell, badge: "alerts" },
  { href: "/ai-workflows", label: "AI Workflows", icon: Workflow },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/locations", label: "Locations", icon: MapPin },
  { href: "/cameras", label: "Cameras", icon: Camera },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/compliance", label: "Compliance", icon: ShieldCheck },
  { href: "/integrations", label: "Integrations", icon: Plug },
  { href: "/settings", label: "Settings", icon: Settings },
];
