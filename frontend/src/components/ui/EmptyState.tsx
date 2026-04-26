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
        "flex flex-col items-center justify-center text-center py-16 px-4",
        className
      )}
    >
      <div className="p-4 rounded-2xl bg-leather-brown/5 mb-4">
        <Icon className="w-10 h-10 text-leather-brown/40" />
      </div>
      <h3 className="text-lg font-serif font-semibold text-dark-walnut mb-1">
        {title}
      </h3>
      <p className="text-sm text-slate max-w-sm mb-5">{description}</p>
      {action}
    </div>
  );
}
