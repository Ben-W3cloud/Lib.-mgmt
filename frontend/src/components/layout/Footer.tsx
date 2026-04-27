/**
 * =============================================================================
 * Footer — Library-themed footer with branding
 * =============================================================================
 */

import { BookOpen } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-dark-walnut border-t border-leather-brown/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-gold-accent" />
            <span className="font-serif text-lg font-semibold text-parchment">
              Bibliotheca
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-parchment/50 text-center">
            A decentralized library management system — powered by blockchain.
          </p>

          {/* Tech stack/Socials - haven't decided yet*/}
          <div className="flex items-center gap-3 text-xs text-parchment/40">
            <Link href="https://github.com/0xAbhi007/bibliotheca">
              <span>Solidity</span>
            </Link>

            <Link href="https://github.com/0xAbhi007/bibliotheca">
              <span className="text-leather-brown/40">•</span>
              <span>Next.js</span>
            </Link>

            <Link href="https://github.com/0xAbhi007/bibliotheca">
              <span className="text-leather-brown/40">•</span>
              <span>wagmi</span>
            </Link>

          </div>
        </div>
      </div>
    </footer>
  );
}
