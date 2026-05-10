/**
 * =============================================================================
 * Modal — Dialog overlay for confirmations and forms
 * =============================================================================
 */

"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Dismiss on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        // Close when clicking the overlay (not the content)
        if (e.target === overlayRef.current) onClose();
      }}
    >
      {/* Overlay backdrop */}
      <div className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md animate-fadeIn" />

      {/* Modal content */}
      <div
        className={cn(
          "relative w-full max-w-lg max-h-[85vh] overflow-y-auto animate-slideUp rounded-2xl border border-white/10 bg-[#0f1729] shadow-[0_30px_120px_rgba(0,0,0,0.5)]",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2 className="text-lg font-serif font-semibold text-[#edf0ff]">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#8e9ab8] transition-colors hover:bg-white/5 hover:text-[#edf0ff]"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
