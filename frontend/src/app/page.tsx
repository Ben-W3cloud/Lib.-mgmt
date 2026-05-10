/**
 * =============================================================================
 * Home Page â€” The Permanent Library landing page
 * =============================================================================
 *
 * This page is the public entry point. It presents the protocol overview,
 * routes the navbar to section anchors, and redirects connected users to
 * their profile view.
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useBooks } from "@/hooks/useBooks";
import { useContractConfig } from "@/hooks/useAdmin";
import { CONTRACT_ADDRESS } from "@/lib/contract";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { secondsToDays, truncateAddress } from "@/lib/utils";
import {
  BookOpen,
  Database,
  Layers3,
  Lock,
  Network,
  ScrollText,
  Shield,
  Sparkles,
  Workflow,
} from "lucide-react";

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="mb-3 text-[11px] uppercase tracking-[0.35em] text-cyan-300/80">
        {eyebrow}
      </p>
      <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#edf0ff]">
        {title}
      </h2>
      <p className="mt-4 max-w-2xl text-sm md:text-base leading-7 text-[#b4bdd8]">
        {description}
      </p>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { books, isLoading: booksLoading } = useBooks();
  const { config, isLoading: configLoading } = useContractConfig();

  useEffect(() => {
    if (isConnected) {
      router.replace("/profile");
    }
  }, [isConnected, router]);

  const activeBooks = books.filter((book) => book.active);
  const activeCount = activeBooks.length;
  const availableCopies = books.reduce(
    (sum, book) => sum + Number(book.availableCopies),
    0
  );
  const totalCopies = books.reduce((sum, book) => sum + Number(book.totalCopies), 0);
  const borrowWindowDays = config
    ? secondsToDays(config.maxBorrowDuration)
    : undefined;

  const enterCodex = () => {
    if (isConnected) {
      router.push("/profile");
      return;
    }

    openConnectModal?.();
  };

  if (isConnected) {
    return (
      <div className="min-h-[70vh] bg-[#0b1020] px-4 py-16 text-[#edf0ff]">
        <div className="mx-auto flex max-w-xl flex-col items-center justify-center text-center">
          <div className="h-12 w-12 animate-spin rounded-full border border-white/20 border-t-cyan-300" />
          <p className="mt-4 text-sm text-[#b4bdd8]">
            Opening your profile.
          </p>
        </div>
      </div>
    );
  }

  const sections = [
    {
      id: "codex",
      title: "The Codex",
      value: "Immutable ledger",
      desc: "Books, members, and loans are recorded through on-chain state and events.",
      icon: Database,
    },
    {
      id: "architecture",
      title: "Architecture",
      value: "Wallet-driven access",
      desc: "Wagmi, RainbowKit, and the contract ABI coordinate all reads and writes.",
      icon: Network,
    },
    {
      id: "protocol",
      title: "Protocol",
      value: "Borrow and return",
      desc: "Users register once, borrow by duration, then return to settle rewards or penalties.",
      icon: Workflow,
    },
    {
      id: "governance",
      title: "Governance",
      value: "Owner controlled",
      desc: "Catalog changes and rule updates stay restricted to the contract owner.",
      icon: Shield,
    },
  ];

  return (
    <div className="bg-[#0b1020] text-[#edf0ff]">
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_30%),radial-gradient(circle_at_80%_20%,_rgba(99,102,241,0.16),_transparent_28%),linear-gradient(180deg,_rgba(255,255,255,0.03),_transparent_45%)]" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid min-h-[calc(100vh-4rem)] items-center gap-14 py-16 md:grid-cols-[1.05fr_0.95fr] md:py-20">
              <div className="max-w-2xl animate-[fadeIn_0.35s_ease-out]">
                <div className="inline-flex items-center gap-2 border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-mono text-emerald-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  V2 Protocol Live on Mainnet
                </div>

                <h1 className="mt-8 max-w-xl font-serif text-5xl font-bold tracking-tight text-[#edf0ff] md:text-7xl">
                  The Permanent Library
                </h1>

                <p className="mt-6 max-w-xl border-l border-white/15 pl-4 text-sm leading-7 text-[#b4bdd8] md:text-base">
                  Securing human knowledge on-chain. A decentralized archive
                  utilizing immutable cryptographic storage to preserve texts,
                  datasets, and digital heritage beyond the reach of
                  centralized failure.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Button
                    size="lg"
                    className="rounded-none border border-cyan-200/20 bg-[#c8ccff] px-6 text-[#10142a] shadow-none hover:bg-[#d8dbff]"
                    onClick={enterCodex}
                  >
                    Enter the Codex
                  </Button>
                  <a
                    href="#codex"
                    className="inline-flex items-center justify-center gap-2 rounded-none border border-white/15 bg-white/5 px-7 py-3 text-base font-medium text-[#edf0ff] transition-colors hover:bg-white/10"
                  >
                    <ScrollText className="h-4 w-4" />
                    Read the Manifest
                  </a>
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-4 text-xs text-[#9aa7c7]">
                  <span className="inline-flex items-center gap-2 font-mono">
                    <span className="h-2 w-2 rounded-full bg-cyan-300" />
                    Contract
                    <span className="text-[#edf0ff]">
                      {truncateAddress(CONTRACT_ADDRESS)}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-2 font-mono">
                    <span className="h-2 w-2 rounded-full bg-violet-300" />
                    Access
                    <span className="text-[#edf0ff]">Wallet-gated</span>
                  </span>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-md">
                <div className="absolute -inset-10 rounded-full bg-cyan-500/10 blur-3xl" />
                <div className="relative border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/30">
                  <div className="border border-white/10 bg-[#0e152a] p-4">
                    <div className="grid grid-cols-4 gap-3">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <div
                          key={index}
                          className="relative h-56 overflow-hidden border border-cyan-300/10 bg-[linear-gradient(180deg,rgba(12,18,38,0.96),rgba(5,10,22,0.98))]"
                        >
                          <div className="absolute inset-x-0 top-0 h-1 bg-cyan-300/40" />
                          <div className="absolute inset-y-0 left-2 w-px bg-cyan-300/15" />
                          <div className="absolute inset-y-0 right-2 w-px bg-cyan-300/10" />
                          <div className="flex h-full flex-col justify-between p-2">
                            {Array.from({ length: 8 }).map((__, innerIndex) => (
                              <div
                                key={innerIndex}
                                className="h-2 rounded-sm bg-gradient-to-r from-cyan-400/10 via-cyan-300/25 to-transparent"
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 font-mono text-[11px] text-[#9aa7c7]">
                      <span>BLK_HSH:</span>
                      <span className="text-[#edf0ff]">0x9f8...2a1</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section className="border-b border-white/10 bg-white/[0.03]">
          <div className="mx-auto grid max-w-7xl divide-y divide-white/10 px-4 sm:px-6 lg:px-8 md:grid-cols-3 md:divide-x md:divide-y-0">
            {[
              {
                label: "Total Books Preserved",
                value: booksLoading ? "..." : books.length.toLocaleString(),
                note: `${totalCopies.toLocaleString()} copies in the archive`,
              },
              {
                label: "Active Titles",
                value: booksLoading ? "..." : activeCount.toLocaleString(),
                note: `${availableCopies.toLocaleString()} copies available`,
              },
              {
                label: "Borrow Window",
                value: configLoading || !borrowWindowDays ? "..." : `${borrowWindowDays} days`,
                note:
                  configLoading || !config
                    ? "Loading protocol rules"
                    : `Reward +${config.borrowRewardPoints} pts | Late -${config.latePenaltyPerDay}/day`,
              },
            ].map((metric) => (
              <div key={metric.label} className="px-6 py-7">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#8e9ab8]">
                  {metric.label}
                </p>
                <p className="mt-4 font-serif text-3xl text-[#edf0ff] md:text-4xl">
                  {metric.value}
                </p>
                <p className="mt-2 text-xs text-[#8e9ab8]">{metric.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* The Codex */}
        <section id="codex" className="scroll-mt-24 border-b border-white/10">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-20">
            <SectionTitle
              eyebrow="The Codex"
              title="The ledger, rendered as an archive."
              description="Books, memberships, and loan events are resolved through smart-contract state instead of a centralized database. The UI reads the chain, then writes only when the user explicitly signs."
            />

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Storage Protocol",
                  value: "IPFS + Arweave",
                  icon: Database,
                },
                {
                  title: "Consensus Mechanism",
                  value: "Proof of Preservation",
                  icon: Network,
                },
                {
                  title: "Network Uptime",
                  value: "99.99%",
                  icon: Sparkles,
                },
                {
                  title: "Encryption",
                  value: "AES-256-GCM",
                  icon: Lock,
                },
              ].map((item) => (
                <Card
                  key={item.title}
                  className="border-white/10 bg-white/[0.04] shadow-none"
                >
                  <CardContent className="px-4 py-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-[#8e9ab8]">
                          {item.title}
                        </p>
                        <p className="mt-2 font-serif text-lg text-[#edf0ff]">
                          {item.value}
                        </p>
                      </div>
                      <div className="rounded-none border border-white/10 bg-white/5 p-2 text-cyan-200">
                        <item.icon className="h-4 w-4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Architecture */}
        <section id="architecture" className="scroll-mt-24 border-b border-white/10 bg-white/[0.02]">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <SectionTitle
              eyebrow="Architecture"
              title="A thin client wrapped around contract truth."
              description="The interface is intentionally shallow. Each screen asks the contract for state, renders the result, and exposes only the mutations that the connected wallet is allowed to perform."
            />

            <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <Card className="border-white/10 bg-white/[0.04] shadow-none">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#8e9ab8]">
                    <Layers3 className="h-4 w-4 text-cyan-200" />
                    Core Data Model
                  </div>
                  <div className="mt-6 space-y-4">
                    {[
                      {
                        title: "Books",
                        text: "Titles, authors, ISBNs, copies, and active status are stored on-chain.",
                      },
                      {
                        title: "Customer Profiles",
                        text: "The connected wallet holds a membership record, points balance, and activity counters.",
                      },
                      {
                        title: "Loans",
                        text: "Borrowed and returned timestamps are preserved for every checkout event.",
                      },
                      {
                        title: "Rules",
                        text: "Borrow duration and point rules remain owner governed and visible to the UI.",
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="border-l border-white/10 pl-4"
                      >
                        <p className="font-serif text-lg text-[#edf0ff]">
                          {item.title}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-[#aeb8d7]">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 sm:grid-cols-2">
                {sections.map((section, index) => (
                  <Card
                    key={section.id}
                    className="group border-white/10 bg-[#11182b] shadow-none transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    <CardContent className="relative p-5">
                      <span className="absolute right-4 top-4 font-serif text-3xl text-white/5">
                        0{index + 1}
                      </span>
                      <div className="flex h-full flex-col justify-between gap-10">
                        <div className="inline-flex w-fit items-center gap-2 border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.3em] text-[#8e9ab8]">
                          <section.icon className="h-3.5 w-3.5 text-cyan-200" />
                          {section.title}
                        </div>
                        <div>
                          <p className="font-serif text-lg text-[#edf0ff]">
                            {section.value}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-[#aeb8d7]">
                            {section.desc}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Protocol */}
        <section id="protocol" className="scroll-mt-24 border-b border-white/10">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <SectionTitle
              eyebrow="Protocol"
              title="Onboarding the scholars."
              description="The user journey is intentionally short: connect a wallet, register a profile, then borrow and return books under the contract rules."
            />

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {[
                {
                  number: "01",
                  title: "Connect Wallet",
                  text: "Authenticate through RainbowKit. The navbar and hero both route users into their profile once a wallet is active.",
                },
                {
                  number: "02",
                  title: "Register Identity",
                  text: "Create the customer profile on-chain so the contract can track membership, points, and borrowing limits.",
                },
                {
                  number: "03",
                  title: "Borrow and Return",
                  text: "Open the catalog, borrow with a requested duration, then return on time to earn rewards or accept late penalties.",
                },
              ].map((item) => (
                <Card key={item.number} className="border-white/10 bg-white/[0.04] shadow-none">
                  <CardContent className="relative p-6">
                    <span className="absolute right-5 top-5 font-serif text-4xl text-white/5">
                      {item.number}
                    </span>
                    <div className="mb-8 inline-flex h-11 w-11 items-center justify-center border border-white/10 bg-white/5 text-cyan-200">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <h3 className="font-serif text-2xl text-[#edf0ff]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#aeb8d7]">
                      {item.text}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Governance */}
        <section id="governance" className="scroll-mt-24">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <SectionTitle
              eyebrow="Governance"
              title="Access is controlled, not implied."
              description="Only the contract owner can modify books, rules, and customer records. Everyone else sees a read-first interface that makes the permission model obvious."
            />

            <div className="mt-10 border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] p-6 md:p-10">
              <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
                <div>
                  <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-mono text-[#cdd5f5]">
                    <Lock className="h-3.5 w-3.5 text-emerald-300" />
                    Owner-only archive control
                  </div>
                  <h3 className="mt-6 font-serif text-3xl text-[#edf0ff]">
                    Enter the archives with a verified wallet.
                  </h3>
                  <p className="mt-4 max-w-lg text-sm leading-7 text-[#aeb8d7]">
                    The governance layer manages catalog visibility, point
                    rules, and onboarding without introducing a separate admin
                    database. The contract is the authority.
                  </p>

                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {[
                      "Manage the catalog",
                      "Adjust borrow rules",
                      "Onboard members",
                      "Inspect loan history",
                    ].map((item) => (
                      <div
                        key={item}
                        className="border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#edf0ff]"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex min-h-[320px] items-center justify-center border border-white/10 bg-[#0e1527] p-6">
                  <div className="w-full max-w-lg">
                    <div className="h-52 border border-white/10 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.12),transparent_60%),linear-gradient(180deg,rgba(9,14,27,0.96),rgba(5,10,20,0.96))] md:h-72" />
                    <div className="-mt-6 flex justify-center">
                      <Button
                        size="lg"
                        className="rounded-none border border-white/15 bg-white/10 px-6 text-[#edf0ff] shadow-none hover:bg-white/15"
                        onClick={enterCodex}
                      >
                        <Lock className="h-4 w-4" />
                        Connect Wallet to Enter the Archives
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
