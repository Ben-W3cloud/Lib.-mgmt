/**
 * =============================================================================
 * EmptyState — Placeholder for empty lists and data
 * =============================================================================
 */

import { LucideIcon, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon = BookOpen,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-16 text-center",
        className
      )}
    >
      <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4">
        <Icon className="w-10 h-10 text-cyan-200/70" />
      </div>
      <h3 className="mb-1 text-lg font-serif font-semibold text-[#edf0ff]">
        {title}
      </h3>
      <p className="mb-5 max-w-sm text-sm text-[#8e9ab8]">{description}</p>
      {action}
    </div>
  );
}
