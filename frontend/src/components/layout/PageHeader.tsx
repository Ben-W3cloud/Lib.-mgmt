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
    <div className={cn("mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div>
        <p className="mb-2 text-[11px] uppercase tracking-[0.35em] text-cyan-200/70">
          Permanent Library
        </p>
        <h1 className="font-serif text-3xl font-bold text-[#edf0ff] md:text-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 max-w-2xl text-sm text-[#8e9ab8] md:text-base">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
