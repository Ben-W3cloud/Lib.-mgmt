"use client";

import { useReadContract } from "wagmi";
import { Reveal, RevealItem } from "@/components/landing/motion-primitives";
import { useTilt } from "@/components/use-tilt";
import { contractConfig, CONTRACT_ADDRESS, IS_CONTRACT_CONFIGURED } from "@/lib/contract";
import { asNumber, shortAddress } from "@/lib/types";

/**
 * Spec sheet — the protocol's instrument panel. Values marked LIVE are read
 * straight from the deployed contract; the rest describe what the system is.
 */
export function Specs() {
  const tilt = useTilt(3);
  const enabled = IS_CONTRACT_CONFIGURED;
  const maxBorrow = useReadContract({
    ...contractConfig,
    functionName: "maxBorrowDuration",
    query: { enabled },
  });
  const maxExtension = useReadContract({
    ...contractConfig,
    functionName: "maxExtensionDays",
    query: { enabled },
  });
  const owner = useReadContract({
    ...contractConfig,
    functionName: "owner",
    query: { enabled },
  });

  const formatDays = (seconds: number | undefined) =>
    seconds === undefined ? "[LOADING]" : `${Math.round(seconds / 86400)} DAYS`;

  const rows: Array<{ label: string; value: string; live?: boolean }> = [
    { label: "Network", value: "SEPOLIA · 11155111" },
    { label: "Contract", value: enabled ? shortAddress(CONTRACT_ADDRESS).toUpperCase() : "[NOT SET]", live: true },
    { label: "Max borrow duration", value: formatDays(asNumber(maxBorrow.data as bigint | undefined)), live: true },
    { label: "Max extension", value: formatDays(asNumber(maxExtension.data as bigint | undefined)), live: true },
    { label: "Owner", value: owner.data ? shortAddress(owner.data as string).toUpperCase() : enabled ? "[LOADING]" : "[NOT SET]", live: true },
    { label: "Loan extensions", value: "SIGNED, NEAR EXPIRY ONLY" },
    { label: "Catalog reads", value: "PAGINATED, ON-DEMAND" },
    { label: "Indexer", value: "NONE — READS ARE DIRECT" },
    { label: "Money movement", value: "ZERO — POINTS ONLY" },
    { label: "Reviews", value: "BORROWER-GATED" },
    { label: "Lister control", value: "PAUSE / STOCK / RESUME" },
  ];

  return (
    <section id="specs" className="landing-section landing-section--tight-top">
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-10">
        <header className="mb-12 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="eyebrow">Specs</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-[var(--display)] md:text-4xl">
              Under the hood.
            </h2>
          </div>
          <p className="max-w-[42ch] text-sm leading-6 text-[var(--muted)]">
            The whole library is one contract on one chain. These are its operating limits.
          </p>
        </header>

        <Reveal>
          <RevealItem>
            <div
              onPointerMove={tilt.onPointerMove}
              onPointerLeave={tilt.onPointerLeave}
              className="tilt"
            >
              <dl className="grid border border-[var(--line)] bg-[var(--panel)]">
                {rows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-baseline justify-between gap-4 border-b border-[var(--line)] px-5 py-4 last:border-b-0 md:px-8"
                  >
                    <dt className="label-caps flex items-center gap-2">
                      {row.live ? <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" /> : null}
                      {row.label}
                    </dt>
                    <dd className={`font-mono text-xs md:text-sm ${row.value.startsWith("[") ? "text-[var(--disabled)]" : "text-[var(--fg)]"}`}>
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </RevealItem>
          <RevealItem>
            {enabled ? (
              <a
                href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noreferrer"
                className="spec-link"
              >
                VIEW ON ETHERSCAN [↗]
              </a>
            ) : (
              <p className="label-caps">[ GREEN DOT = READ LIVE FROM CHAIN ]</p>
            )}
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
}
