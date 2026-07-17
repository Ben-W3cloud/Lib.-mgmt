"use client";

import { Reveal, RevealItem } from "@/components/landing/motion-primitives";

// Reuses the three original "why it exists" facts, in the icon-column layout.
const points = [
  {
    tag: "01",
    title: "No indexer",
    body: "The app reads contract state directly. What you see on screen is exactly what the chain holds — nothing cached, nothing invented.",
    icon: (
      <path d="M4 7h16M4 12h16M4 17h10" strokeWidth="1.75" strokeLinecap="round" />
    ),
  },
  {
    tag: "02",
    title: "Points, not fees",
    body: "Borrow and return on time to earn points. Miss the due date and the ledger docks them. No money changes hands, only reputation.",
    icon: (
      <path
        d="M12 3l2.4 5.2 5.6.6-4.2 3.8 1.2 5.6L12 15.9 6.8 18.8 8 13.2 3.8 9.4l5.6-.6z"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    ),
  },
  {
    tag: "03",
    title: "Anyone can list",
    body: "Own the copies you list. Set counts, pause a title, add stock later. The lister stays in control from first block to last.",
    icon: (
      <>
        <rect x="4" y="5" width="6.5" height="14" rx="1.4" strokeWidth="1.6" />
        <path d="M13.5 5h6.5v14h-6.5z" strokeWidth="1.6" />
      </>
    ),
  },
];

export function Why() {
  return (
    <section id="about" className="landing-section landing-section--tight-bottom">
      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10">
        <Reveal className="mx-auto max-w-[20rem] text-center sm:max-w-[34rem] md:max-w-[42rem]">
          <RevealItem>
            <p className="eyebrow">Why it exists</p>
          </RevealItem>
          <RevealItem>
            <h2 className="mt-4 text-balance text-[clamp(2.25rem,7vw,3.75rem)] font-semibold leading-[1.03] tracking-tight">
              A lending record nobody has to trust.
            </h2>
          </RevealItem>
        </Reveal>

        <RevealItem>
          <p className="mx-auto mt-6 max-w-[58ch] text-balance text-center text-base leading-7 text-[var(--muted)] md:text-lg md:leading-8">
            Move the library notebook on-chain and the trust question disappears. Every listing,
            loan, and return is a transaction — signed by a wallet, visible to all, argued by no one.
          </p>
        </RevealItem>

        <div className="mt-14 border-t border-[var(--line)] md:mt-20" />

        <Reveal
          as="ul"
          className="grid gap-x-10 gap-y-12 pt-12 sm:grid-cols-2 md:pt-16 lg:grid-cols-3"
          amount={0.15}
        >
          {points.map((point) => (
            <RevealItem key={point.tag} className="grid content-start gap-3">
              <span className="font-mono text-sm text-[var(--muted)]">{point.tag}</span>
              <span className="text-[var(--accent)]" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="h-7 w-7"
                >
                  {point.icon}
                </svg>
              </span>
              <h3 className="mt-1 text-2xl font-semibold tracking-tight">{point.title}</h3>
              <p className="max-w-[42ch] text-base leading-7 text-[var(--muted)]">{point.body}</p>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
