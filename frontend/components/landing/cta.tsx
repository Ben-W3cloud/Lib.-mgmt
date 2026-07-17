"use client";

import { useAccount } from "wagmi";
import { EnterAppButton } from "@/components/landing/enter-app-button";
import { Reveal, RevealItem } from "@/components/landing/motion-primitives";

export function Cta({ onNeedsConnect }: { onNeedsConnect: () => void }) {
  const { isConnected } = useAccount();

  return (
    <section id="get-started" className="landing-section">
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-10">
        <Reveal className="landing-cta">
          <div aria-hidden="true" className="landing-cta-glow" />
          <div className="relative z-[2] grid gap-8 p-10 md:grid-cols-[1.4fr_0.6fr] md:items-center md:p-16">
            <div>
              <RevealItem>
                <p className="eyebrow">Ready when your wallet is</p>
              </RevealItem>
              <RevealItem>
                <h2 className="mt-4 max-w-[18ch] text-4xl font-semibold leading-[1.02] tracking-tight md:text-6xl">
                  Sign once. Borrow like the ledger is watching.
                </h2>
              </RevealItem>
              <RevealItem>
                <p className="mt-6 max-w-[56ch] text-lg leading-8 text-[var(--muted)]">
                  {isConnected
                    ? "Wallet connected. Head to the desk to browse the catalog and open your first loan."
                    : "Connect a wallet on Sepolia to register a profile, list a title, or borrow a copy."}
                </p>
              </RevealItem>
            </div>
            <RevealItem className="flex md:justify-end">
              <EnterAppButton variant="primary" onNeedsConnect={onNeedsConnect} className="px-7 text-base">
                {isConnected ? "Go to the desk" : "Connect and enter"}
              </EnterAppButton>
            </RevealItem>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
