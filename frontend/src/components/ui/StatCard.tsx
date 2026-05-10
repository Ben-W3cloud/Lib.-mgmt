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
        "rounded-2xl border border-white/10 bg-white/[0.04] p-5",
        "transition-shadow duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-[#8e9ab8]">{label}</p>
          <p className="font-serif text-2xl font-bold text-[#edf0ff]">
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
