"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { springSmooth } from "@/components/landing/motion-primitives";

export type ToastState = { id: number; message: string } | null;

/** Returns a trigger fn and the rendered toast node. Auto-dismisses after 4s. */
export function useToast() {
  const [toast, setToast] = useState<ToastState>(null);
  const timer = useRef<number | null>(null);

  const show = useCallback((message: string) => {
    if (timer.current) window.clearTimeout(timer.current);
    setToast({ id: Date.now(), message });
    timer.current = window.setTimeout(() => setToast(null), 4000);
  }, []);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  return { show, node: <Toast toast={toast} onClose={() => setToast(null)} /> };
}

function Toast({ toast, onClose }: { toast: ToastState; onClose: () => void }) {
  const reduced = useReducedMotion();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex justify-center px-4" aria-live="polite">
      <AnimatePresence>
        {toast ? (
          <motion.div
            key={toast.id}
            role="status"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
            transition={springSmooth}
            className="pointer-events-auto flex max-w-[26rem] items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--panel)] px-4 py-3 shadow-[var(--shadow-lift)] backdrop-blur-xl"
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--accent-soft)] font-mono text-xs font-bold text-[var(--accent)]">
              i
            </span>
            <p className="text-sm leading-6 text-[var(--fg)]">{toast.message}</p>
            <button type="button" onClick={onClose} className="ml-1 text-xs font-semibold text-[var(--muted)] hover:text-[var(--fg)]" aria-label="Dismiss">
              Close
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
