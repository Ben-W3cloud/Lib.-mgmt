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
        "bg-cream rounded-xl border border-leather-brown/10 shadow-sm",
        "transition-all duration-300",
        hover && "hover:shadow-lg hover:-translate-y-1 hover:border-leather-brown/25 cursor-pointer",
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
    <div className={cn("px-6 pt-6 pb-2", className)}>
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
