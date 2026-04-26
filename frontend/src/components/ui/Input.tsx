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
            className="block text-sm font-medium text-dark-walnut"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full px-4 py-2.5 rounded-lg border bg-parchment/50 text-ink-black",
            "placeholder:text-slate/60",
            "focus:outline-none focus:ring-2 focus:ring-leather-brown/40 focus:border-leather-brown",
            "transition-all duration-200",
            error
              ? "border-dusty-rose focus:ring-dusty-rose/40"
              : "border-leather-brown/20 hover:border-leather-brown/40",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className
          )}
          {...props}
        />
        {hint && !error && (
          <p className="text-xs text-slate">{hint}</p>
        )}
        {error && (
          <p className="text-xs text-dusty-rose font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
