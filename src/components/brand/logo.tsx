import Link from "next/link";
import { LogoMark } from "./logo-mark";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  iconSize = 28,
  onClick,
}: {
  className?: string;
  iconSize?: number;
  onClick?: () => void;
}) {
  return (
    <Link href="/" onClick={onClick} className={cn("group flex items-center gap-2", className)}>
      <LogoMark size={iconSize} />
      <span className="text-sm font-semibold tracking-tight">
        Vision
        <span className="text-info transition-colors group-hover:text-primary">AI</span>
      </span>
    </Link>
  );
}
