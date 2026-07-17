"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { EnterAppButton } from "@/components/landing/enter-app-button";
import { springDramatic } from "@/components/landing/motion-primitives";

export function Hero({ onNeedsConnect }: { onNeedsConnect: () => void }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", "38%"]);
  const gridY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const headline = ["Books move", "when wallets", "agree."];

  return (
    <section ref={ref} className="landing-hero relative overflow-hidden">
      {/* Decorative parallax layers */}
      <motion.div aria-hidden="true" className="landing-hero-glow" style={{ y: reduced ? 0 : glowY }} />
      <motion.div aria-hidden="true" className="landing-hero-grid" style={{ y: reduced ? 0 : gridY }} />

      <motion.div
        className="relative z-[2] mx-auto grid w-full max-w-[1400px] gap-14 px-4 pb-24 pt-20 md:px-10 md:pb-32 md:pt-28 lg:grid-cols-[1.35fr_0.65fr] lg:items-end"
        style={{ opacity: reduced ? 1 : contentOpacity }}
      >
        <div>
          <motion.p
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springDramatic, delay: 0.1 }}
            className="eyebrow"
          >
            On-chain lending desk · Sepolia
          </motion.p>

          <h1 className="mt-5 max-w-[15ch] text-[clamp(2.75rem,12vw,3.75rem)] font-semibold leading-[0.94] tracking-tight md:text-8xl md:leading-[0.92]">
            {headline.map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: "108%" }}
                  animate={reduced ? { opacity: 1 } : { opacity: 1, y: "0%" }}
                  transition={{ ...springDramatic, delay: 0.16 + i * 0.09 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springDramatic, delay: 0.5 }}
            className="mt-8 max-w-[54ch] text-lg leading-8 text-[var(--muted)]"
          >
            A library that runs on a contract, not a spreadsheet. List titles with real copy
            counts, borrow what is free, return on time, and let the ledger keep score.
          </motion.p>

          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springDramatic, delay: 0.62 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <EnterAppButton variant="primary" onNeedsConnect={onNeedsConnect} className="px-6">
              Open the desk
            </EnterAppButton>
            <a className="btn-secondary px-6" href="#how-it-works">
              See how it works
            </a>
          </motion.div>
        </div>

        {/* Ledger receipt card */}
        <motion.aside
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springDramatic, delay: 0.4 }}
          className="landing-receipt"
          aria-hidden="true"
        >
          <div className="flex items-center justify-between border-b border-dashed border-[var(--line)] pb-3">
            <span className="font-mono text-xs font-bold uppercase text-[var(--accent)]">Loan #4127</span>
            <span className="font-mono text-xs text-[var(--muted)]">confirmed</span>
          </div>
          <div className="grid gap-3 py-4 font-mono text-sm">
            <ReceiptRow label="Title" value="The Undercommons" />
            <ReceiptRow label="Borrower" value="0x8fd2…a41c" />
            <ReceiptRow label="Due" value="Aug 02, 14:20" />
            <ReceiptRow label="Points" value="+12" accent />
          </div>
          <div className="border-t border-dashed border-[var(--line)] pt-3 font-mono text-[0.7rem] leading-5 text-[var(--muted)]">
            block 6,284,119 · gas 0.00021 ETH · no middleman
          </div>
        </motion.aside>
      </motion.div>
    </section>
  );
}

function ReceiptRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className={accent ? "font-semibold text-[var(--accent)]" : "text-[var(--fg)]"}>{value}</span>
    </div>
  );
}
