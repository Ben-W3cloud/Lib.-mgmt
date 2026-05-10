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
    "bg-[#c8ccff] text-[#10142a] hover:bg-[#d8dbff] shadow-[0_16px_40px_rgba(200,204,255,0.18)]",
  secondary:
    "bg-white/5 text-[#edf0ff] hover:bg-white/10 border border-white/10",
  danger:
    "bg-rose-500/15 text-rose-200 hover:bg-rose-500/20 border border-rose-400/20",
  ghost:
    "bg-transparent text-[#b4bdd8] hover:bg-white/5 border border-white/10",
  gold:
    "bg-cyan-300 text-[#08101d] hover:bg-cyan-200 shadow-[0_16px_40px_rgba(103,232,249,0.15)] font-semibold",
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
        "focus:outline-none focus:ring-2 focus:ring-cyan-300/50 focus:ring-offset-2 focus:ring-offset-[#020617]",
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
