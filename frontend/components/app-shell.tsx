"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { useAccount } from "wagmi";
import { RouteProgress } from "@/components/route-progress";
import { WalletPill } from "@/components/wallet-pill";
import { IS_CONTRACT_CONFIGURED, CONTRACT_CHAIN_ID } from "@/lib/contract";

// App routes, shown once a wallet is connected.
const appNav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/browse", label: "Browse" },
  { href: "/list", label: "List book" },
  { href: "/listings", label: "My listings" },
  { href: "/profile", label: "Profile" },
];

// Landing section anchors, shown while no wallet is connected.
const landingNav = [
  { href: "#about", label: "Why" },
  { href: "#how-it-works", label: "How" },
  { href: "#specs", label: "Specs" },
  { href: "#faq", label: "FAQ" },
  { href: "#get-started", label: "Enter" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const { isConnected } = useAccount();
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 380);
    return () => window.clearTimeout(timer);
  }, []);

  // Landing anchors only make sense on the landing route; elsewhere fall back to app routes.
  const showLandingNav = !isConnected && isLanding;
  const items = showLandingNav ? landingNav : appNav;
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="min-h-[100dvh] bg-[var(--bg)] text-[var(--fg)]">
      <RouteProgress />
      {!ready ? <Preloader /> : null}
      <header className="app-header sticky top-0 z-[30]">
        <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3 md:grid md:grid-cols-[1fr_auto_1fr] md:px-10">
          <Link href="/" className="brand-mark md:justify-self-start" aria-label="Folio home">
            <span className="brand-dot" aria-hidden="true" />
            <span>
              <span className="block text-base font-medium tracking-tight text-[var(--display)]">Folio</span>
              <span className="label-caps block !text-[var(--disabled)]">On-chain library</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex md:flex-wrap md:gap-1 md:justify-self-center" aria-label="Primary navigation">
            {items.map((item) => (
              <NavItem key={item.href} item={item} landing={showLandingNav} pathname={pathname} onNavigate={closeMenu} />
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 md:ml-0 md:justify-self-end">
            <WalletPill />
            <button
              type="button"
              className="nav-toggle md:hidden"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="sr-only">Menu</span>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" aria-hidden="true">
                {menuOpen ? (
                  <path d="M6 6l12 12M18 6L6 18" strokeWidth="2" strokeLinecap="round" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" strokeWidth="2" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile nav drawer */}
        {menuOpen ? (
          <nav className="border-t border-[var(--line)] px-4 py-2 md:hidden" aria-label="Primary navigation">
            <div className="grid gap-1 pb-2">
              {items.map((item) => (
                <NavItem key={item.href} item={item} landing={showLandingNav} pathname={pathname} block onNavigate={closeMenu} />
              ))}
            </div>
          </nav>
        ) : null}
      </header>
      {isConnected && !IS_CONTRACT_CONFIGURED ? (
        <div className="mx-auto max-w-[1400px] px-4 pt-4 md:px-10">
          <div className="status-note status-warning" role="status">
            Contract address missing. Set <code>NEXT_PUBLIC_LIBRARY_ADDRESS</code> and keep chain id at <code>{CONTRACT_CHAIN_ID}</code> unless using local Hardhat.
          </div>
        </div>
      ) : null}
      <main className={isLanding ? "w-full" : "mx-auto w-full max-w-[1400px] px-4 py-8 md:px-10 md:py-12"}>{children}</main>
    </div>
  );
}

function NavItem({
  item,
  landing,
  pathname,
  block,
  onNavigate,
}: {
  item: { href: string; label: string };
  landing: boolean;
  pathname: string;
  block?: boolean;
  onNavigate: () => void;
}) {
  const cls = block ? "nav-pill nav-pill--block" : "nav-pill";
  if (landing) {
    return (
      <a href={item.href} className={cls} onClick={onNavigate}>
        {item.label}
      </a>
    );
  }
  const active = pathname === item.href;
  return (
    <Link href={item.href} className={active ? `${cls} nav-pill-active` : cls} onClick={onNavigate}>
      {item.label}
    </Link>
  );
}

function Preloader() {
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-[var(--bg)]" role="status" aria-live="polite">
      <div className="preloader-panel">
        <span className="label-caps">[ Loading catalog ]</span>
        <span className="seg-bar seg-bar-animated" aria-hidden="true">
          <i /><i /><i /><i /><i /><i />
        </span>
      </div>
    </div>
  );
}

