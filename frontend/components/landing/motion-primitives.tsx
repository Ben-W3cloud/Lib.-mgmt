"use client";

import { motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform, type Variants } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

export const springSmooth = { type: "spring", stiffness: 100, damping: 20 } as const;
export const springDramatic = { type: "spring", stiffness: 60, damping: 18 } as const;
export const springSnappy = { type: "spring", stiffness: 400, damping: 30 } as const;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: springSmooth },
};

const reducedVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
};

/** Wraps a group; children marked with <RevealItem> rise in sequence when scrolled into view. */
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

/** Counts from 0 to `value` when scrolled into view. Respects reduced-motion (snaps to value). */
export function CountUp({
  value,
  duration = 1.6,
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
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 55, damping: 22, duration });
  const display = useTransform(spring, (latest) =>
    `${prefix}${latest.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`
  );

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      motionValue.jump(value);
      return;
    }
    motionValue.set(value);
  }, [inView, reduced, value, motionValue]);

  return (
    <span ref={ref} className={className} aria-label={`${prefix}${value}${suffix}`}>
      <motion.span aria-hidden="true">{display}</motion.span>
    </span>
  );
}
