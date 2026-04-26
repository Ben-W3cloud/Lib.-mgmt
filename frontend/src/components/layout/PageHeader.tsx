/**
 * =============================================================================
 * PageHeader — Reusable page title with optional subtitle and action
 * =============================================================================
 */

import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, action, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8", className)}>
      <div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-dark-walnut">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-slate text-sm md:text-base">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
