/**
 * =============================================================================
 * StatCard — Dashboard statistic card with icon and label
 * =============================================================================
 */

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  accent?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = "bg-leather-brown/10 text-leather-brown",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-cream rounded-xl border border-leather-brown/10 p-5",
        "hover:shadow-md transition-shadow duration-300",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-slate font-medium">{label}</p>
          <p className="text-2xl font-serif font-bold text-dark-walnut">
            {value}
          </p>
        </div>
        <div className={cn("p-2.5 rounded-lg", accent)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
