/**
 * =============================================================================
 * Navbar â€” Section-aware navigation and wallet entry point
 * =============================================================================
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useIsOwner, useMyProfile } from "@/hooks/useUser";
import { BookOpen, Menu, Shield, User, X } from "lucide-react";
import { useState } from "react";
import { cn, truncateAddress } from "@/lib/utils";

const homeLinks = [
  { href: "#codex", label: "The Codex" },
  { href: "#architecture", label: "Architecture" },
  { href: "#protocol", label: "Protocol" },
  { href: "#governance", label: "Governance" },
];

const userLinks = [
  { href: "/books", label: "Browse Books", icon: BookOpen },
  { href: "/loans", label: "My Loans" },
  { href: "/profile", label: "Profile", icon: User },
];

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: Shield },
  { href: "/admin/books", label: "Manage Books" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/rules", label: "Rules" },
];

function WalletButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        mounted,
        openAccountModal,
        openChainModal,
        openConnectModal,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        if (!ready) {
          return (
            <button
              className="inline-flex items-center justify-center border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-[#edf0ff]"
              type="button"
            >
              Connect Wallet
            </button>
          );
        }

        if (!connected) {
          return (
            <button
              onClick={openConnectModal}
              className="inline-flex items-center justify-center border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-[#edf0ff] transition-colors hover:bg-white/10"
              type="button"
            >
              Connect Wallet
            </button>
          );
        }

        if (chain.unsupported) {
          return (
            <button
              onClick={openChainModal}
              className="inline-flex items-center justify-center border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-sm font-medium text-amber-100 transition-colors hover:bg-amber-300/15"
              type="button"
            >
              Wrong Network
            </button>
          );
        }

        return (
          <button
            onClick={openAccountModal}
            className="inline-flex items-center justify-center border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-[#edf0ff] transition-colors hover:bg-white/10"
            type="button"
          >
            {truncateAddress(account.address)}
          </button>
        );
      }}
    </ConnectButton.Custom>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { isConnected } = useAccount();
  const { isOwner } = useIsOwner();
  const { isRegistered } = useMyProfile();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHome = pathname === "/";
  const isAdminSection = pathname.startsWith("/admin");
  const links = isHome ? homeLinks : isAdminSection && isOwner ? adminLinks : userLinks;
  const linkHref = (href: string) =>
    isHome ? href : href.startsWith("#") ? `/${href}` : href;

  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-[#0b1020]/95 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center border border-white/10 bg-white/5">
              <BookOpen className="h-5 w-5 text-cyan-200" />
            </div>
            <span className="font-serif text-xl font-bold tracking-wide text-[#edf0ff]">
              The Permanent Library
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={linkHref(link.href)}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors",
                  isHome
                    ? "text-[#b4bdd8] hover:bg-white/5 hover:text-[#edf0ff]"
                    : pathname === link.href
                      ? "bg-white/5 text-[#edf0ff]"
                      : "text-[#b4bdd8] hover:bg-white/5 hover:text-[#edf0ff]"
                )}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {!isHome && isConnected && isOwner && !isAdminSection && (
              <Link
                href="/admin/dashboard"
                className="px-4 py-2 text-sm font-medium text-cyan-200 transition-colors hover:bg-white/5 hover:text-[#edf0ff]"
              >
                Admin
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isConnected && isRegistered && !isHome && (
              <span className="hidden items-center gap-1.5 border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-xs font-medium text-emerald-300 sm:inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                Registered
              </span>
            )}

            <div className="hidden sm:block">
              <WalletButton />
            </div>

            <button
              onClick={() => setMobileOpen((open) => !open)}
              className="border border-white/10 bg-white/5 p-2 text-[#edf0ff] transition-colors hover:bg-white/10 md:hidden"
              type="button"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-white/10 pb-4 pt-3 md:hidden">
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={linkHref(link.href)}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "px-3 py-2 text-sm font-medium transition-colors",
                    isHome
                      ? "text-[#b4bdd8] hover:bg-white/5 hover:text-[#edf0ff]"
                      : pathname === link.href
                        ? "bg-white/5 text-[#edf0ff]"
                        : "text-[#b4bdd8] hover:bg-white/5 hover:text-[#edf0ff]"
                  )}
                >
                  {link.label}
                </Link>
              ))}

              {!isHome && isConnected && isOwner && !isAdminSection && (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-cyan-200 transition-colors hover:bg-white/5 hover:text-[#edf0ff]"
                >
                  Admin Panel
                </Link>
              )}

              <div className="mt-2 px-1">
                <WalletButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
