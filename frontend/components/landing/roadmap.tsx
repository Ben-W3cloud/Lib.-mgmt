"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal, RevealItem } from "@/components/landing/motion-primitives";
import { SegmentedBar } from "@/components/ui";

const steps = [
  {
    tag: "01",
    title: "Register your borrower profile",
    body: "One transaction writes your name, member code, and metadata to the contract. The wallet that signs it becomes your library card.",
    fn: "Register Profile",
    tx: "REGISTERCUSTOMER()",
  },
  {
    tag: "02",
    title: "List a book with real copy counts",
    body: "Add a title, author, ISBN, and how many copies you hold. You stay the lister — pause it or add stock whenever you want.",
    fn: "Add Books",
    tx: "ADDBOOK()",
  },
  {
    tag: "03",
    title: "Browse the shelves, borrow what's free",
    body: "Search the catalog by title, author, or ISBN. Pick a duration, sign, and the copy is yours until the due date.",
    fn: "Borrow Books",
    tx: "BORROWBOOK()",
  },
  {
    tag: "04",
    title: "Return on time, collect the points",
    body: "Hand the copy back before it is due and the ledger credits your balance. Late returns cost points. The record settles itself.",
    fn: "Return and Gain",
    tx: "RETURNBOOK()",
  },
  {
    tag: "05",
    title: "Review what you actually read",
    body: "Only wallets that borrowed a title can review it — every rating carries a loan behind it. Your take becomes part of the copy's permanent record.",
    fn: "Add Review",
    tx: "ADDREVIEW()",
  },
];

export function Roadmap() {
  const listRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  // Mechanical scroll tracker: whichever node crosses the viewport center
  // becomes the live readout. No springs, no smooth interpolation.
  useEffect(() => {
    const root = listRef.current;
    if (!root) return;
    const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-step]"));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveStep(Number((entry.target as HTMLElement).dataset.step));
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" className="landing-section landing-section--tight-top">
      <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-4 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-16 md:px-10">
        {/* Sticky control column with live readout */}
        <header className="self-start md:sticky md:top-32">
          <Reveal>
            <RevealItem>
              <p className="eyebrow">How it works</p>
            </RevealItem>
            <RevealItem>
              <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight text-[var(--display)] md:text-5xl">
                Five transactions, start to finish.
              </h2>
            </RevealItem>
          </Reveal>

          {/* Live instrument: current position in the sequence */}
          <div className="mt-8 grid max-w-[240px] gap-2 border border-[var(--line)] bg-[var(--panel)] p-4">
            <span className="label-caps">Sequence</span>
            <span className="font-doto text-3xl font-semibold leading-none text-[var(--display)]">
              {steps[activeStep].tag}
              <span className="text-lg text-[var(--disabled)]"> / 0{steps.length}</span>
            </span>
            <SegmentedBar filled={activeStep + 1} total={steps.length} height="h-[6px]" />
            <span className="font-mono text-xs leading-5 text-[var(--muted)]">{steps[activeStep].fn.toUpperCase()}</span>
          </div>
        </header>

        {/* Step nodes */}
        <div ref={listRef} className="relative pl-10 md:pl-14">
          <div className="landing-rail-track" aria-hidden="true" />
          {steps.map((step, i) => (
            <div key={step.tag} data-step={i} className="relative pb-12 last:pb-0">
              <span aria-hidden="true" className="landing-rail-dot" style={i <= activeStep ? { background: "var(--display)" } : undefined} />
              <Reveal amount={0.5}>
                <article className="landing-step-card transition-colors duration-200 hover:border-[var(--muted)]">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-[var(--muted)]">{step.tag}</span>
                    <span className="landing-step-fn">{step.fn}</span>
                  </div>
                  <h3 className="mt-3 text-xl font-medium text-[var(--display)] md:text-2xl">{step.title}</h3>
                  <p className="mt-2 max-w-[58ch] text-sm leading-6 text-[var(--muted)] md:text-base md:leading-7">{step.body}</p>
                  <p className="label-caps mt-4 border-t border-[var(--line)] pt-3 !text-[var(--disabled)]">TX · {step.tx}</p>
                </article>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
