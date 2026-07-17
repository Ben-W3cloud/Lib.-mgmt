"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { springSmooth } from "@/components/landing/motion-primitives";

const steps = [
  {
    tag: "01",
    title: "Register your borrower profile",
    body: "One transaction writes your name, member code, and metadata to the contract. The wallet that signs it becomes your library card.",
    fn: "Register Profile",
  },
  {
    tag: "02",
    title: "List a book with real copy counts",
    body: "Add a title, author, ISBN, and how many copies you hold. You stay the lister — pause it or add stock whenever you want.",
    fn: "Add Books",
  },
  {
    tag: "03",
    title: "Browse and borrow what is free",
    body: "Search the catalog by title, author, or ISBN. Pick a duration, sign, and the copy is yours until the due date.",
    fn: "Borrow Books",
  },
  {
    tag: "04",
    title: "Return on time, collect the points",
    body: "Hand the copy back before it is due and the ledger credits your balance. Late returns cost points. The record settles itself.",
    fn: "Return and Gain",
  },
];

export function Roadmap() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 65%", "end 55%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 80, damping: 26 });
  const scaleY = useTransform(reduced ? scrollYProgress : fill, [0, 1], [0, 1]);

  return (
    <section id="how-it-works" className="landing-section landing-section--tight-top">
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-10">
        <header className="mb-14 max-w-[46ch]">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-4 text-4xl font-semibold leading-[1.02] tracking-tight md:text-5xl">
            Four transactions, start to finish.
          </h2>
        </header>

        <div ref={ref} className="relative grid gap-0 pl-12 md:pl-20">
          {/* Rail track */}
          <div className="landing-rail-track" aria-hidden="true" />
          {/* Scroll-driven fill */}
          <motion.div
            className="landing-rail-fill"
            style={{ scaleY, transformOrigin: "top" }}
            aria-hidden="true"
          />

          {steps.map((step, i) => (
            <TimelineNode key={step.tag} step={step} index={i} total={steps.length} progress={reduced ? scrollYProgress : fill} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineNode({
  step,
  index,
  total,
  progress,
}: {
  step: (typeof steps)[number];
  index: number;
  total: number;
  progress: ReturnType<typeof useSpring>;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  // Node lights up once the fill passes its position on the rail.
  const threshold = index / (total - 1 || 1);
  const dotColor = useTransform(progress, [threshold - 0.02, threshold + 0.02], ["var(--line)", "var(--accent)"]);
  const dotScale = useTransform(progress, [threshold - 0.02, threshold + 0.02], [1, 1.35]);

  return (
    <motion.div
      ref={ref}
      initial={reduced ? { opacity: 0 } : { opacity: 0, x: 24 }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ ...springSmooth, delay: 0.05 }}
      className="relative pb-14 last:pb-0"
    >
      {/* Node dot on the rail */}
      <motion.span
        aria-hidden="true"
        className="landing-rail-dot"
        style={{ backgroundColor: dotColor, scale: reduced ? 1 : dotScale }}
      />
      <div className="landing-step-card">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-bold text-[var(--accent)]">{step.tag}</span>
          <span className="rounded-full border border-[var(--line)] bg-[var(--panel-strong)] px-2.5 py-0.5 font-mono text-[0.7rem] uppercase tracking-wide text-[var(--muted)]">
            {step.fn}
          </span>
        </div>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight">{step.title}</h3>
        <p className="mt-2 max-w-[58ch] text-base leading-7 text-[var(--muted)]">{step.body}</p>
      </div>
    </motion.div>
  );
}
