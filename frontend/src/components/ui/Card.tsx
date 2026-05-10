/**
 * =============================================================================
 * Card — Base card component with library-themed styling
 * =============================================================================
 */

import { cn } from "@/lib/utils";

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ className, children, hover = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-[#0f1729] rounded-2xl border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.24)]",
        "transition-all duration-300",
        hover && "hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_28px_90px_rgba(0,0,0,0.34)] cursor-pointer",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("px-6 pt-6 pb-3", className)}>
      {children}
    </div>
  );
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("px-6 pb-6", className)}>
      {children}
    </div>
  );
}
