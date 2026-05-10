/**
 * =============================================================================
 * Input — Form input component with label, error state, and consistent styling
 * =============================================================================
 */

"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[#edf0ff]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-xl border bg-white/5 px-4 py-3 text-[#edf0ff]",
            "placeholder:text-[#7380a5]",
            "focus:outline-none focus:ring-2 focus:ring-cyan-300/30 focus:border-cyan-300/40",
            "transition-all duration-200",
            error
              ? "border-rose-400/40 focus:ring-rose-300/30"
              : "border-white/10 hover:border-white/20",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className
          )}
          {...props}
        />
        {hint && !error && (
          <p className="text-xs text-[#8e9ab8]">{hint}</p>
        )}
        {error && (
          <p className="text-xs font-medium text-rose-200">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
