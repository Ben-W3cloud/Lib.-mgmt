/**
 * =============================================================================
 * Navbar — Main navigation bar with wallet connect and role-based links
 * =============================================================================
 *
 * Features:
 * - Library branding (Bibliotheca)
 * - Navigation links (role-dependent: shows admin links only for owner)
 * - RainbowKit ConnectButton for wallet connection
 * - Mobile responsive hamburger menu
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useIsOwner, useMyProfile } from "@/hooks/useUser";
import { BookOpen, Menu, X, Shield, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Navigation items — shown based on connection and role state
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

export function Navbar() {
  const pathname = usePathname();
  const { isConnected } = useAccount();
  const { isOwner } = useIsOwner();
  const { isRegistered } = useMyProfile();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Determine which links to show based on the current page context
  const isAdminSection = pathname.startsWith("/admin");
  const links = isAdminSection && isOwner ? adminLinks : userLinks;

  return (
    <nav className="sticky top-0 z-40 bg-dark-walnut/95 backdrop-blur-md border-b border-leather-brown/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-1.5 rounded-lg bg-leather-brown/20 group-hover:bg-leather-brown/30 transition-colors">
              <BookOpen className="w-5 h-5 text-gold-accent" />
            </div>
            <span className="font-serif text-xl font-bold text-parchment tracking-wide">
              Bibliotheca
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {isConnected &&
              links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    pathname === link.href
                      ? "bg-leather-brown/25 text-gold-accent"
                      : "text-parchment/70 hover:text-parchment hover:bg-leather-brown/10"
                  )}
                >
                  {link.label}
                </Link>
              ))}

            {/* Show admin toggle if user is owner and NOT in admin section */}
            {isConnected && isOwner && !isAdminSection && (
              <Link
                href="/admin/dashboard"
                className="px-3 py-2 rounded-lg text-sm font-medium text-gold-accent/80 hover:text-gold-accent hover:bg-leather-brown/10 transition-all flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin
              </Link>
            )}
            {isConnected && isAdminSection && (
              <Link
                href="/books"
                className="px-3 py-2 rounded-lg text-sm font-medium text-parchment/70 hover:text-parchment hover:bg-leather-brown/10 transition-all"
              >
                ← Library
              </Link>
            )}
          </div>

          {/* Right section: wallet + mobile menu */}
          <div className="flex items-center gap-3">
            {/* Registration badge */}
            {isConnected && isRegistered && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-full bg-forest-green/15 text-forest-green text-xs font-medium border border-forest-green/25">
                <span className="w-1.5 h-1.5 rounded-full bg-forest-green animate-pulse" />
                Registered
              </span>
            )}

            <ConnectButton
              chainStatus="icon"
              accountStatus="avatar"
              showBalance={false}
            />

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-parchment/70 hover:bg-leather-brown/10"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileOpen && (
          <div className="md:hidden pb-4 animate-slideDown">
            <div className="flex flex-col gap-1 pt-2 border-t border-leather-brown/20">
              {isConnected &&
                links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      pathname === link.href
                        ? "bg-leather-brown/25 text-gold-accent"
                        : "text-parchment/70 hover:text-parchment hover:bg-leather-brown/10"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              {isConnected && isOwner && !isAdminSection && (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-gold-accent/80 hover:text-gold-accent hover:bg-leather-brown/10 flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin Panel
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
