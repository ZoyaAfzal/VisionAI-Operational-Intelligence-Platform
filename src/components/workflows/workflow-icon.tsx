import {
  Droplets,
  Users,
  Hand,
  TriangleAlert,
  Table2,
  Clock,
  TrendingUp,
  Gauge,
  RotateCw,
  Thermometer,
  ShieldCheck,
  Sparkles,
  DoorOpen,
  UserX,
  UserCog,
  Workflow,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Droplets,
  Users,
  Hand,
  TriangleAlert,
  Table2,
  Clock,
  TrendingUp,
  Gauge,
  RotateCw,
  Thermometer,
  ShieldCheck,
  Sparkles,
  DoorOpen,
  UserX,
  UserCog,
};

export function WorkflowIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Workflow;
  return <Icon className={className} />;
}
