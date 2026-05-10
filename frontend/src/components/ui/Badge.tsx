/**
 * =============================================================================
 * Badge — Status badge for book/loan states
 * =============================================================================
 */

import { cn } from "@/lib/utils";

interface BadgeProps {
  variant: "success" | "warning" | "danger" | "neutral" | "gold";
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const variants: Record<string, string> = {
  success: "bg-emerald-400/10 text-emerald-300 border-emerald-300/20",
  warning: "bg-amber-400/10 text-amber-200 border-amber-300/20",
  danger: "bg-rose-500/10 text-rose-200 border-rose-400/20",
  neutral: "bg-white/5 text-[#9aa7c7] border-white/10",
  gold: "bg-cyan-300/10 text-cyan-200 border-cyan-300/20",
};

export function Badge({ variant, children, className, dot = false }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border",
        variants[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            variant === "success" && "bg-emerald-300",
            variant === "warning" && "bg-amber-300",
            variant === "danger" && "bg-rose-300",
            variant === "neutral" && "bg-[#9aa7c7]",
            variant === "gold" && "bg-cyan-300"
          )}
        />
      )}
      {children}
    </span>
  );
}
