"use client";

import { useAccount } from "wagmi";
import { EnterAppButton } from "@/components/landing/enter-app-button";
import { Reveal, RevealItem } from "@/components/landing/motion-primitives";
import { useTilt } from "@/components/use-tilt";

export function Cta({ onNeedsConnect }: { onNeedsConnect: () => void }) {
  const { isConnected } = useAccount();
  const tilt = useTilt(3);

  return (
    <section id="get-started" className="landing-section">
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-10">
        <Reveal className="landing-cta">
          <div
            onPointerMove={tilt.onPointerMove}
            onPointerLeave={tilt.onPointerLeave}
            className="tilt relative z-[2] grid gap-8 p-10 md:grid-cols-[1.4fr_0.6fr] md:items-center md:p-16"
          >
            <div>
              <RevealItem>
                <p className="eyebrow">Your card is waiting</p>
              </RevealItem>
              <RevealItem>
                <h2 className="mt-4 max-w-[18ch] text-3xl font-semibold leading-tight text-[var(--display)] md:text-5xl">
                  <span className="text-[var(--accent)]">One signature,</span> and the shelves open.
                </h2>
              </RevealItem>
              <RevealItem>
                <p className="mt-6 max-w-[56ch] text-base leading-7 text-[var(--muted)] md:text-lg md:leading-8">
                  {isConnected
                    ? "You're in. Open your folio to browse the shelves or check what's due back."
                    : "Connect an Ethereum wallet on Sepolia to register your card, list a title, or borrow a copy."}
                </p>
              </RevealItem>
              <RevealItem>
                <p className="label-caps mt-7">No fees · No token · No middleman</p>
              </RevealItem>
            </div>
            <RevealItem className="flex md:justify-end">
              <EnterAppButton variant="primary" onNeedsConnect={onNeedsConnect} className="text-base">
                {isConnected ? "Open my folio" : "Get your library card"}
              </EnterAppButton>
            </RevealItem>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
