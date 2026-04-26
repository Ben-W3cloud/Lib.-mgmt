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
  success: "bg-forest-green/15 text-forest-green border-forest-green/25",
  warning: "bg-gold-accent/15 text-gold-accent border-gold-accent/30",
  danger: "bg-dusty-rose/15 text-dusty-rose border-dusty-rose/25",
  neutral: "bg-slate/10 text-slate border-slate/20",
  gold: "bg-gold-accent/20 text-gold-accent border-gold-accent/30",
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
            variant === "success" && "bg-forest-green",
            variant === "warning" && "bg-gold-accent",
            variant === "danger" && "bg-dusty-rose",
            variant === "neutral" && "bg-slate",
            variant === "gold" && "bg-gold-accent"
          )}
        />
      )}
      {children}
    </span>
  );
}
