"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useRef, useState } from "react";
import { useDisconnect } from "wagmi";
import { Spinner } from "@/components/ui";

// Custom wallet control matching the landing theme. Replaces the default
// RainbowKit button: connect CTA, wrong-network warning, and a connected
// pill with a copy / disconnect dropdown.
export function WalletPill() {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready && account && chain && (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && { "aria-hidden": true, style: { opacity: 0, pointerEvents: "none", userSelect: "none" } })}
          >
            {!ready ? (
              <span className="wallet-pill wallet-pill--ghost">
                <Spinner className="h-4 w-4" />
                <span>Loading</span>
              </span>
            ) : !connected ? (
              <button type="button" onClick={openConnectModal} className="btn-primary px-4">
                Connect wallet
              </button>
            ) : chain.unsupported ? (
              <button type="button" onClick={openChainModal} className="btn-danger px-4">
                Wrong network
              </button>
            ) : (
              <ConnectedPill
                address={account.address}
                display={account.displayName}
                chainName={chain.name}
                hasIcon={Boolean(chain.iconUrl)}
                chainIcon={chain.iconUrl}
                chainColor={chain.iconBackground}
                openChainModal={openChainModal}
              />
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}

function ConnectedPill({
  address,
  display,
  chainName,
  hasIcon,
  chainIcon,
  chainColor,
  openChainModal,
}: {
  address: string;
  display: string;
  chainName?: string;
  hasIcon: boolean;
  chainIcon?: string;
  chainColor?: string;
  openChainModal: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard blocked; no-op
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="wallet-pill"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="wallet-pill-dot" aria-hidden="true" />
        <span className="font-mono text-sm">{display}</span>
        <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" aria-hidden="true">
          <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open ? (
        <div role="menu" className="wallet-menu">
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              openChainModal();
              setOpen(false);
            }}
            className="wallet-menu-item"
          >
            <span className="flex items-center gap-2">
              {hasIcon && chainIcon ? (
                <span
                  className="h-4 w-4 shrink-0 rounded-full bg-cover"
                  style={{ background: chainColor, backgroundImage: `url(${chainIcon})` }}
                  aria-hidden="true"
                />
              ) : (
                <span className="wallet-pill-dot" aria-hidden="true" />
              )}
              {chainName ?? "Network"}
            </span>
            <span className="text-xs text-[var(--muted)]">Switch</span>
          </button>
          <button type="button" role="menuitem" onClick={copy} className="wallet-menu-item">
            <span>Copy address</span>
            <span className="text-xs text-[var(--accent)]">{copied ? "Copied" : ""}</span>
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              disconnect();
              setOpen(false);
            }}
            className="wallet-menu-item wallet-menu-item--danger"
          >
            Disconnect
          </button>
        </div>
      ) : null}
    </div>
  );
}
