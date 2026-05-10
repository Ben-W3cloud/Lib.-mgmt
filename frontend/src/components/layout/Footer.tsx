/**
 * =============================================================================
 * Footer â€” Home page navigation and project links
 * =============================================================================
 */

import Link from "next/link";
import { BookOpen } from "lucide-react";

const sectionLinks = [
  { href: "/#codex", label: "The Codex" },
  { href: "/#architecture", label: "Architecture" },
  { href: "/#protocol", label: "Protocol" },
  { href: "/#governance", label: "Governance" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0b1020]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-cyan-200" />
              <span className="font-serif text-lg font-semibold text-[#edf0ff]">
                The Permanent Library
              </span>
            </div>
            <p className="max-w-md text-sm leading-6 text-[#8e9ab8]">
              A decentralized archive for books, loans, and governance records
              preserved through contract-level truth.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-[0.28em] text-[#8e9ab8]">
            {sectionLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-[#edf0ff]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="https://github.com/0xAbhi007/bibliotheca"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-[#edf0ff]"
            >
              GitHub
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-4 text-[11px] text-[#7080a4] sm:flex-row sm:items-center sm:justify-between">
          <p>2026 The Permanent Library. All knowledge secured on-chain.</p>
          <p className="font-mono">Ethereum smart contract protocol</p>
        </div>
      </div>
    </footer>
  );
}
