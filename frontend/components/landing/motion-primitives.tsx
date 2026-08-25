"use client";

import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { useRef, type ReactNode } from "react";

// Nothing system: percussive, not fluid. Ease-out tweens only — no springs,
// no bounce. Elements fade; they do not slide or overshoot.
export const springSmooth = { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] } as const;
export const springDramatic = { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] } as const;
export const springSnappy = { duration: 0.15, ease: [0.25, 0.1, 0.25, 1] } as const;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] } },
};

const reducedVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.01 } },
};

/** Wraps a group; children marked with <RevealItem> fade in sequence when scrolled into view. */
export function Reveal({
  children,
  className,
  as = "div",
  once = true,
  amount = 0.3,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "ul" | "ol";
  once?: boolean;
  amount?: number;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount });
  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      ref={ref}
      className={className}
      variants={reduced ? reducedVariants : containerVariants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
    >
      {children}
    </MotionTag>
  );
}

export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div className={className} variants={reduced ? reducedVariants : itemVariants}>
      {children}
    </motion.div>
  );
}

/**
 * Displays `value` when scrolled into view. No tween — the number appears at
 * once, like an instrument readout switching on.
 */
export function CountUp({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
  className,
}: {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <span ref={ref} className={className} aria-label={`${prefix}${value}${suffix}`}>
      {inView ? `${prefix}${value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}` : ""}
    </span>
  );
}
