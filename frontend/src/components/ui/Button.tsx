/**
 * =============================================================================
 * Button — Reusable button component with variants and loading state
 * =============================================================================
 */

"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<string, string> = {
  primary:
    "bg-leather-brown text-cream hover:bg-leather-brown/90 shadow-md hover:shadow-lg",
  secondary:
    "bg-dark-walnut text-parchment hover:bg-dark-walnut/80 border border-leather-brown/30",
  danger:
    "bg-dusty-rose text-cream hover:bg-dusty-rose/90 shadow-md",
  ghost:
    "bg-transparent text-leather-brown hover:bg-leather-brown/10 border border-leather-brown/20",
  gold:
    "bg-gold-accent text-dark-walnut hover:bg-gold-accent/90 shadow-md font-semibold",
};

const sizeStyles: Record<string, string> = {
  sm: "px-3 py-1.5 text-sm rounded-md",
  md: "px-5 py-2.5 text-sm rounded-lg",
  lg: "px-7 py-3 text-base rounded-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-leather-brown/50 focus:ring-offset-2 focus:ring-offset-parchment",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
