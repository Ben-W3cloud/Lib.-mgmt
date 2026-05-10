/**
 * =============================================================================
 * BookCover â€” Deterministic generated cover art for catalog cards
 * =============================================================================
 */

"use client";

import { cn } from "@/lib/utils";

const COVER_PALETTES = [
  "from-cyan-400/35 via-slate-900 to-[#0b1020]",
  "from-violet-300/35 via-slate-900 to-[#0b1020]",
  "from-emerald-300/30 via-slate-900 to-[#0b1020]",
  "from-sky-300/30 via-slate-900 to-[#0b1020]",
  "from-fuchsia-300/25 via-slate-900 to-[#0b1020]",
  "from-amber-200/20 via-slate-900 to-[#0b1020]",
];

const ACCENTS = [
  "bg-cyan-300",
  "bg-violet-300",
  "bg-emerald-300",
  "bg-sky-300",
  "bg-fuchsia-300",
  "bg-amber-200",
];

function getSeed(value: string | number | bigint) {
  const raw = typeof value === "string" ? value : value.toString();
  let total = 0;
  for (let i = 0; i < raw.length; i += 1) {
    total += raw.charCodeAt(i) * (i + 1);
  }
  return total;
}

function getInitials(title: string, author?: string) {
  const titleParts = title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "");

  if (titleParts.length >= 2) {
    return titleParts.join("");
  }

  const authorInitial = author?.trim().charAt(0).toUpperCase() ?? "B";
  return `${titleParts[0] ?? "B"}${authorInitial}`.slice(0, 2);
}

interface BookCoverProps {
  title: string;
  author?: string;
  isbn?: string;
  seed: string | number | bigint;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function BookCover({
  title,
  author,
  isbn,
  seed,
  size = "md",
  className,
}: BookCoverProps) {
  const index = getSeed(seed) % COVER_PALETTES.length;
  const palette = COVER_PALETTES[index];
  const accent = ACCENTS[index];
  const initials = getInitials(title, author);

  const sizeStyles = {
    sm: "aspect-[4/5] w-full max-w-[140px]",
    md: "aspect-[4/5] w-full max-w-[180px]",
    lg: "aspect-[4/5] w-full max-w-[280px]",
  }[size];

  const titleSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-lg",
  }[size];

  return (
    <div
      className={cn(
        "relative overflow-hidden border border-white/10 bg-[#0e1527] shadow-[0_24px_60px_rgba(0,0,0,0.35)]",
        sizeStyles,
        className
      )}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br", palette)} />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_35%,transparent_70%,rgba(255,255,255,0.06))]" />
      <div className="absolute inset-x-0 top-0 h-2 bg-white/10" />
      <div className="absolute inset-y-0 left-0 w-1.5 bg-white/10" />
      <div className="absolute inset-0">
        <div className="absolute inset-y-0 left-5 w-px bg-white/10" />
        <div className="absolute inset-y-0 right-5 w-px bg-white/10" />
        <div className="absolute left-0 top-1/3 h-px w-full bg-white/10" />
      </div>

      <div className="relative flex h-full flex-col justify-between p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center border border-white/15 bg-black/20 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-white/70">
            Archive
          </span>
          <span className={cn("h-2.5 w-2.5 rounded-full", accent)} />
        </div>

        <div className="flex flex-1 items-center justify-center px-2">
          <div className="text-center text-[#eef2ff]">
            <div
              className={cn(
                "mx-auto flex items-center justify-center border border-white/15 bg-[#0b1020]/70 font-serif font-bold tracking-[0.2em]",
                size === "lg"
                  ? "h-24 w-24 text-3xl"
                  : size === "md"
                    ? "h-20 w-20 text-2xl"
                    : "h-16 w-16 text-lg"
              )}
            >
              {initials}
            </div>
            <p className={cn("mt-4 font-serif font-semibold leading-tight", titleSize)}>
              {title}
            </p>
            {author && (
              <p className="mt-2 text-[11px] uppercase tracking-[0.24em] text-white/70">
                {author}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white/70">
          <span>{isbn ?? "PL-ARCHIVE"}</span>
          <span>V2</span>
        </div>
      </div>
    </div>
  );
}
